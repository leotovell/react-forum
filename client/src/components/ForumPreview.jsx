import React from "react";
import ForumBanner from "./ForumBanner";
import ForumPlaceholderPosts from "./ForumPlaceholderPosts";

function ForumPreview(props) {
  return (
    <div>
      <ForumBanner {...props} />
      <ForumPlaceholderPosts />
    </div>
  );
}

export default ForumPreview;
