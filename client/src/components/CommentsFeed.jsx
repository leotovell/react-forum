import React from "react";
import Comment from "./Comment";

function CommentsFeed(props) {
  const comments = props.comments;
  const user = props.user;
  return (
    <div>
      {comments.map((comment) => (
        <Comment
          data={comment}
          user={user}
          key={comment.id}
          setReloadPosts={props.setReloadPosts}
        />
      ))}
    </div>
  );
}

export default CommentsFeed;
