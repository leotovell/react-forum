import React from "react";
import { Container, Image, Row } from "react-bootstrap";
import sadface from "../assets/img/page/sadface.svg";

function ErrorNotice({ title, description }) {
  return (
    <Container fluid className="">
      <Row
        xs={5}
        className="d-flex justify-content-center align-items-center m-5"
      >
        <Image src={sadface} fluid style={{ opacity: "0.5" }} />
      </Row>
      <Row xs={2} className="d-flex justify-content-center align-items-center">
        <div className="m-5">
          <h1 style={{ textAlign: "center" }}>{title}</h1>
          <br />
          {description.map((el, idx) => (
            <h4 style={{ textAlign: "center" }}>{el}</h4>
          ))}
        </div>
      </Row>
    </Container>
  );
}

export default ErrorNotice;
