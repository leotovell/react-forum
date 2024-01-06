import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";

function ForumBanner(props) {
  return (
    <div className="forum-banner">
      <Container fluid>
        <Row>
          <Col xs={4} md={3} className="forum-image">
            <img src={props.forumImage} className="img-fluid" />
          </Col>
          <Col xs={5} md={7} className="forum-title-desc">
            <h1>{props.forumName}</h1>

            <h3>{props.desc}</h3>
          </Col>
          <Col xs={3} md={2} className="forum-buttons">
            <Button>Follow</Button>
            <Button>New Post</Button>
            <Button>Share</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ForumBanner;
