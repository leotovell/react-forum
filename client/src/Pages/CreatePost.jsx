import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import { useNavigate, useParams } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const { url } = useParams();
  const navigate = useNavigate();
  const [forumNotFound, setForumNotFound] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await httpClient.post("/api/get-forum", { url });
        setForumNotFound(false);
      } catch (error) {
        setForumNotFound(true);
      } finally {
        setPageLoading(false);
      }
    })();
  });

  const submitPost = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/create-post", {
        title,
        content,
        url,
      });
      window.location.href = "/";
    } catch (error) {
      alert("error creating post");
    }
  };

  return (
    <div>
      {pageLoading ? (
        // LOADER
        <div className="loader-container overlay">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          {forumNotFound ? (
            // FORUM NOT FOUND ERROR 404
            `Error: Forum (forum/${url}) doesn't exist...`
          ) : (
            // MAIN PAGE
            <span>
              <a href="/forums">Forums</a> {">"}{" "}
              <a href={`/forum/${url}`}>{url}</a> {">"}
              <u>Create a post</u>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePost;
