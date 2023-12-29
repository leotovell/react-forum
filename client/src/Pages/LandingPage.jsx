import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import PostsFeed from "../components/PostsFeed";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(1);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [reloadPosts, setReloadPosts] = useState(false);

  const logoutUser = async () => {
    const resp = await httpClient.post("//localhost:5000/logout");
    window.location.href = "/";
  };

  useEffect(() => {
    setIsLoadingPosts(true);
  }, [reloadPosts]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("//localhost:5000/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

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
      <h1>Welcome to my forum</h1>
      {user != null ? (
        <div>
          <p>You are logged in.</p>
          <a href="/create-post">
            <button>Create new post</button>
          </a>
          <button onClick={logoutUser}>Logout</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in</p>
          <div>
            <a href="/login">
              <button>Login</button>
            </a>
            <a href="/register">
              <button>Register</button>
            </a>
          </div>
        </div>
      )}
      <hr />
      <h1>Posts:</h1>
      {isLoadingPosts ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          <PostsFeed
            posts={posts}
            currentUser={user}
            setReloadPosts={setReloadPosts}
          />
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
