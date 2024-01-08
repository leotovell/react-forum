import React from "react";
import ForumBanner from "./ForumBanner";
import ForumPlaceholderPosts from "./ForumPlaceholderPosts";

function ForumPreview(props) {
  return (
    <div>
      <ForumBanner {...props} />
      <ForumPlaceholderPosts />
      <div className="bottom-blur"></div>
    </div>
  );
}

export default ForumPreview;
