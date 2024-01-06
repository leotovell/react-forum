import React from "react";
import { Placeholder, Button } from "react-bootstrap";
import ForumBanner from "./ForumBanner";

function ForumPreview(props) {
  return (
    <div>
      <ForumBanner {...props} />
    </div>
  );
}

export default ForumPreview;
