import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import httpClient from "../httpClient";
import PostsFeed from "../components/PostsFeed";
import Pagination from "../components/Pagination";

const Forum = (props) => {
  const { user } = useAuth();
  const forum = useParams();
  const navigate = useNavigate();
  const forum_id = forum.id;
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [reloadPosts, setReloadPosts] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [forumName, setForumName] = useState(forum_id);
  const [forumNotFound, setForumNotFound] = useState(false);

  useEffect(() => {
    setIsLoadingPosts(true);
  }, [reloadPosts]);

  const location = useLocation();
  const page = parseInt(new URLSearchParams(location.search).get("page") || 1);

  const goToPage = (pageNumber) => {
    setIsLoadingPosts(true);
    navigate(`/?page=${pageNumber}`);
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post("//localhost:5000/get-posts-forum", {
          forum_id,
          page,
        });
        setPosts(resp.data.posts);
        setPostCount(resp.data.total_posts);
        setIsLoadingPosts(false);
        setReloadPosts(false);
      } catch (error) {
        console.log(error);
        setForumNotFound(true);
        console.log("Not found");
        // setIsLoadingPosts(false);
      }
    })();
  }, [page, location.key, reloadPosts]);

  console.log(forumNotFound);

  return (
    <div>
      <div className="forum-banner">
        <h1>{forumName}</h1>
      </div>
      {isLoadingPosts ? (
        forumNotFound ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>Not Found</>
        )
      ) : (
        <>Posts </>
      )}
    </div>
  );
};

export default Forum;
