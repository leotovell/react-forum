import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

function ForumBanner(props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFollow = () => {
    alert("handling follow");
  };

  const handleShare = () => {
    alert("handling share");
  };

  return (
    <div className="forum-banner" style={props.style}>
      <Container fluid>
        <Row>
          <Col
            xs={4}
            md={3}
            className="forum-image d-flex flex-column justify-content-center align-items-center"
          >
            <img
              src={props.forumImage}
              alt="The Forum (covers 20% of the banner)"
              className="img-fluid"
            />
          </Col>
          <Col xs={5} md={7} className="forum-title-desc">
            <h1 className="forum-title">{props.forumName}</h1>

            <h3 className="forum-desc">{props.desc}</h3>
          </Col>
          <Col
            xs={3}
            md={2}
            className="buttons d-flex flex-column justify-content-center"
          >
            {user ? (
              <Button className="my-2" onClick={handleFollow}>
                Follow
              </Button>
            ) : (
              <Button
                className="my-2"
                onClick={() => navigate(`/login?redirect=/forum/${props.url}`)}
              >
                Login to Follow
              </Button>
            )}
            <Button className="my-2" onClick={() => navigate(`create-post`)}>
              New Post
            </Button>
            <Button className="my-2" onClick={handleShare}>
              Share
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

ForumBanner.defaultProps = {
  style: {},
};

export default ForumBanner;
