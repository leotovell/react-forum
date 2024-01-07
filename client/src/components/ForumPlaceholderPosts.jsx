import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";

function ForumPlaceholderPosts() {
  const rowCount = 5;
  return (
    <div>
      <Container fluid className="mt-3">
        <Row>
          <Col xs={9}>
            {Array.from({ length: rowCount }, (_, idx) => (
              <Card className="my-2">
                <Card.Body>
                  <Placeholder as={Card.Title} animation="wave">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="wave">
                    <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                    <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                    <Placeholder xs={8} />
                  </Placeholder>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col xs={3}>
            <Row className="mb-3" style={{ marginRight: "1px" }}>
              <h2>Forum info</h2>
              <Placeholder as="div" animation="glow">
                <Placeholder xs={12} />
                <Placeholder xs={12} />
                <Placeholder xs={12} />
              </Placeholder>
            </Row>
            <hr></hr>
            <Row style={{ marginRight: "1px" }}>
              <h2>Trending</h2>
              {Array.from({ length: 10 }, (_, idx) => (
                <Card className="my-1">
                  <Row className="my-3">
                    <Col xs="auto">{"#" + (idx + 1)}</Col>
                    <Col>
                      <Placeholder as="div" animation="glow">
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                      </Placeholder>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Row>
            <hr></hr>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ForumPlaceholderPosts;
