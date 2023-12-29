import React, { useState } from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";

function PostControls(props) {
  const post_id = props.id;
  const [visibleComment, setVisibleComment] = useState(false);
  const [comment, setComment] = useState("");
  const toggleHidden = props.setHidden;
  const hidden = props.hidden;
  const setReloadPosts = props.setReloadPosts;

  const onDelete = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/delete-post", {
        post_id,
      });
      window.location.href = "/";
    } catch (error) {
      alert("Unauthorised.");
    }
  };

  const onComment = () => {
    setVisibleComment(!visibleComment);
  };

  const navigate = useNavigate();
  const submitComment = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/post-comment", {
        post_id,
        comment,
      });
      setReloadPosts(true);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        // window.location.href = "/login";
        navigate("/login");
      }
    }
  };

  return (
    <div>
      <button onClick={() => toggleHidden(!hidden)}>Hide/Close</button>
      <button onClick={onComment}>Comment</button>
      <button onClick={onDelete}>Delete</button>
      <br hidden={!visibleComment} />
      <textarea
        hidden={!visibleComment}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comment here..."
      />
      <button hidden={!visibleComment} onClick={submitComment}>
        Post Comment
      </button>
    </div>
  );
}

export default PostControls;
