import React, { useEffect, useRef, useState } from "react";
import httpClient from "../httpClient";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  FloatingLabel,
  Form,
  InputGroup,
  Overlay,
  Tab,
  Tabs,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Post from "../components/Post";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { url } = useParams();
  const navigate = useNavigate();
  const [forumNotFound, setForumNotFound] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const imageUploadRef = useRef(null);
  const submitRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        await httpClient.post("//localhost:5000/api/get-forum", { url });
        setForumNotFound(false);
      } catch (error) {
        setForumNotFound(true);
      } finally {
        setPageLoading(false);
      }
    })();
  });

  const submitPost = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/create-post", {
        title,
        content,
        url,
      });
      navigate(`/${url}`);
    } catch (error) {
      alert("error creating post");
    }
  };

  const [image, setImage] = useState(null);
  const handleImageUpload = (file) => {
    var reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {pageLoading ? (
        // LOADER
        <div className="loader-container overlay">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          {forumNotFound ? (
            // FORUM NOT FOUND ERROR 404
            `Error: Forum (forum/${url}) doesn't exist...`
          ) : (
            // MAIN PAGE
            <div>
              <div className="breadcrumbs my-2">
                <span className="m-4">
                  <a href="/forums">Forums</a> {">"}{" "}
                  <a href={`/forum/${url}`}>{url}</a> {">"}
                  <u>Create a post</u>
                </span>
              </div>
              <Tabs
                defaultActiveKey="edit"
                id="post-create-tabs"
                className="mb-2"
                fill
              >
                <Tab
                  eventKey="edit"
                  title="Edit"
                  style={{ marginBottom: "0 !important" }}
                >
                  <Form className="m-2">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Title"
                      className="mb-2"
                    >
                      <Form.Control
                        type="text"
                        value={title}
                        placeholder="Interesting title!"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Content"
                      className="mb-2"
                    >
                      <Form.Control
                        type="textarea"
                        style={{ height: "10rem" }}
                        as="textarea"
                        value={content}
                        placeholder="Some cool content!"
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </FloatingLabel>
                    <InputGroup className="mb-3">
                      <Form.Control
                        ref={imageUploadRef}
                        type="file"
                        accept=".png, .jpg"
                        onChange={(e) => {
                          handleImageUpload(e.target.files[0]);
                        }}
                      ></Form.Control>
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setImage(null);
                          imageUploadRef.current.value = "";
                        }}
                        id="button-addon2"
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          style={{ color: "red" }}
                        />
                      </Button>
                    </InputGroup>

                    {image && <img src={image} alt="User-uploaded-img" />}
                  </Form>
                </Tab>
                <Tab
                  eventKey="preview"
                  title="Preview"
                  style={{ marginBottom: "0 !important" }}
                >
                  <Post title={title} content={content} url={url} />
                </Tab>
              </Tabs>
              <Button
                ref={submitRef}
                onClick={submitPost}
                variant="primary"
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "20px",
                  zIndex: 1000,
                  boxShadow: "rgba(0, 0, 0, 0.2) 9px 5px 6px 1px", // Add drop shadow
                  // You can add more styles as needed
                }}
              >
                Create Post
              </Button>
              <Overlay target={submitRef.current} show={false} placement="left">
                {(props) => (
                  <Tooltip id="overlay-example" {...props}>
                    <u>Fix errors</u>
                  </Tooltip>
                )}
              </Overlay>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePost;
