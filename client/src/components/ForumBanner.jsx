import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";

function ForumBanner(props) {
  return (
    <div className="forum-banner">
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
            <Button className="my-2">Follow</Button>
            <Button className="my-2">New Post</Button>
            <Button className="my-2">Share</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ForumBanner;
