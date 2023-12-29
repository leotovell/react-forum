import React from "react";
import Post from "./Post";

function PostsFeed(props) {
  const posts = props.posts;
  const user = props.currentUser;
  return (
    <div>
      {posts.map((post) => (
        <Post
          data={post}
          user={user}
          key={post.id}
          setReloadPosts={props.setReloadPosts}
        />
      ))}
    </div>
  );
}

export default PostsFeed;
