import React, { useState } from "react";

function Forum(props) {
  const forumName = props.forumName;
  const forumPublic = props.public;

  return <div>{forumName}</div>;
}

export default Forum;
