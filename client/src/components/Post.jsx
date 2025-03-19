import React, { useEffect, useState } from "react";
import PostControls from "./PostControls";
import CommentsFeed from "./CommentsFeed";
import { Card } from "react-bootstrap";

function Post({ title, content, url }) {
  // const post = props.data;
  // const user = props.user;
  // const [isHidden, setIsHidden] = useState(false);

  // const toggleVisiblity = () => {
  //   setIsHidden(!isHidden);
  // };

  const [forum, setForum] = useState({
    title: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post("//localhost:5000/api/get-forum", {
          url,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  });

  return (
    <div>
      <Card>
        <Card.Header>Posted in {url}</Card.Header>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle>{url}</Card.Subtitle>
        </Card.Body>
      </Card>
    </div>
    // <div key={post.id} className="post-container">
    //   <h2>{post.title}</h2>
    //   <hr></hr>
    //   <div className={`${isHidden ? "hidden" : ""}`}>
    //     <span>{post.content}</span>
    //     <p>
    //       Posted by{" "}
    //       {user ? (
    //         user.id == post.author ? (
    //           <b>You</b>
    //         ) : (
    //           post.author
    //         )
    //       ) : (
    //         post.author
    //       )}{" "}
    //       at <i>{post.date}</i>
    //     </p>
    //     {/* Comments */}
    //     <h3>
    //       <hr></hr>
    //       <u>Comments</u>
    //     </h3>
    //     {post.comments.length > 0 ? (
    //       <CommentsFeed
    //         comments={post.comments}
    //         user={user}
    //         setReloadPosts={props.setReloadPosts}
    //       />
    //     ) : (
    //       <p>
    //         <i>No Comments...</i>
    //       </p>
    //     )}
    //     {/* <CommentsFeed comments={post.comments} user={user} /> */}
    //   </div>
    //   <PostControls
    //     id={post.id}
    //     setHidden={setIsHidden}
    //     hidden={isHidden}
    //     setReloadPosts={props.setReloadPosts}
    //   />
    // </div>
  );
}

export default Post;
