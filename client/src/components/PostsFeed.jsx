import React from "react";
import Post from "./Post";
import { useAuth } from "./AuthProvider";

function PostsFeed({ posts }) {
  const { user } = useAuth();
  return (
    <div>
      {posts.map((post) => (
        <Post
          data={post}
          user
          key={post.id}
          // setReloadPosts={props.setReloadPosts}
        />
      ))}
    </div>
  );
}

export default PostsFeed;
