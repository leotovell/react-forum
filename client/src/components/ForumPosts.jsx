import React from "react";
import { Card, Col, Container, Placeholder, Row } from "react-bootstrap";

const ForumPosts = (props) => {
  const rowCount = 9;
  const settings = props.settings;
  const forum = props.forum;
  console.log(settings);
  return (
    <div>
      <Container fluid className="mt-3">
        {!settings.public ? (
          <Row>
            <Col xs={9}>
              {Array.from({ length: rowCount }, (_, idx) => (
                <Card className="my-2" key={"post" + idx}>
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
                  <Card className="my-1" key={"trend" + idx}>
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
        ) : (
          <Row>
            <h1>
              Seems quiet in here! Be the first to make a{" "}
              <a href={window.location.href + "/create-post"}>post!</a>
            </h1>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ForumPosts;
