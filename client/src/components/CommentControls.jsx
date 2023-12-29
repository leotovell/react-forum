import React from "react";
import httpClient from "../httpClient";

function CommentControls(props) {
  const comment_id = props.id;
  const setReloadPosts = props.setReloadPosts;
  const onDelete = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/delete-comment", {
        comment_id,
      });
      setReloadPosts(true);
    } catch (error) {
      alert("Unauthorised.");
    }
  };

  return (
    <div>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

export default CommentControls;
