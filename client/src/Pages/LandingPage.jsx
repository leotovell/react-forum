import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import PostsFeed from "../components/PostsFeed";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useAuth } from "../components/AuthProvider";

const LandingPage = () => {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(1);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [reloadPosts, setReloadPosts] = useState(false);

  useEffect(() => {
    setIsLoadingPosts(true);
  }, [reloadPosts]);

  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const page = parseInt(new URLSearchParams(location.search).get("page") || 1);

  const goToPage = (pageNumber) => {
    setIsLoadingPosts(true);
    navigate(`/?page=${pageNumber}`);
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post("//localhost:5000/get-posts", {
          page,
        });
        setPosts(resp.data.posts);
        setPostCount(resp.data.total_posts);
        setIsLoadingPosts(false);
        setReloadPosts(false);
      } catch (error) {
        console.log("Error (404)");
      }
    })();
  }, [page, location.key, reloadPosts]);

  return (
    <div>
      <h1>Welcome to Leo's Forum</h1>
      <hr />
      <h1>Posts:</h1>
      {isLoadingPosts ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          {posts.length > 0 ? (
            <PostsFeed
              posts={posts}
              currentUser={user}
              setReloadPosts={setReloadPosts}
            />
          ) : (
            <div>
              <span>
                <i>No Posts...</i>
              </span>
            </div>
          )}
        </div>
      )}
      <hr></hr>
      <div className="pagination-container">
        <Pagination page={page} pageCount={postCount} goToPageFunc={goToPage} />
      </div>
    </div>
  );
};

export default LandingPage;
