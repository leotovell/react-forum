import React from "react";
import CommentControls from "./CommentControls";

function Comment(props) {
  const comment = props.data;
  const user = props.user;
  return (
    <div className="comment-container">
      <span>{comment.content}</span>
      <p>
        Commented by{" "}
        {user ? (
          user.id == comment.author ? (
            <b>You</b>
          ) : (
            comment.author
          )
        ) : (
          comment.author
        )}{" "}
        at <i>{comment.date}</i>
      </p>
      <CommentControls id={comment.id} setReloadPosts={props.setReloadPosts} />
    </div>
  );
}

export default Comment;
