import React, { useState } from "react";
import PostControls from "./PostControls";
import CommentsFeed from "./CommentsFeed";

function Post(props) {
  const post = props.data;
  const user = props.user;
  const [isHidden, setIsHidden] = useState(false);

  const toggleVisiblity = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div key={post.id} className="post-container">
      <h2>{post.title}</h2>
      <hr></hr>
      <div className={`${isHidden ? "hidden" : ""}`}>
        <span>{post.content}</span>
        <p>
          Posted by{" "}
          {user ? (
            user.id == post.author ? (
              <b>You</b>
            ) : (
              post.author
            )
          ) : (
            post.author
          )}{" "}
          at <i>{post.date}</i>
        </p>
        {/* Comments */}
        <h3>
          <hr></hr>
          <u>Comments</u>
        </h3>
        {post.comments.length > 0 ? (
          <CommentsFeed
            comments={post.comments}
            user={user}
            setReloadPosts={props.setReloadPosts}
          />
        ) : (
          <p>
            <i>No Comments...</i>
          </p>
        )}
        {/* <CommentsFeed comments={post.comments} user={user} /> */}
      </div>
      <PostControls
        id={post.id}
        setHidden={setIsHidden}
        hidden={isHidden}
        setReloadPosts={props.setReloadPosts}
      />
    </div>
  );
}

export default Post;
