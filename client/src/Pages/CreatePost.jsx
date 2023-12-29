import React, { useState } from "react";
import httpClient from "../httpClient";

const CreatePost = () => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const submitPost = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/create-post", {
        title,
        content,
      });
      window.location.href = "/";
    } catch (error) {
      alert("error creating post");
    }
  };

  return (
    <div>
      <h1>Create new Post</h1>

      <form>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            type="text"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
        <div>
          <button type="button" onClick={submitPost}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
