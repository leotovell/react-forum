import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../components/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const { user } = useAuth();
  if (user) {
    navigate("/");
  }

  const logInUser = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/login", {
        email,
        password,
      });
      navigate("/");
    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid Credetials (401)");
      }
    }
  };

  const resetPassword = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/reset-password", {
        resetEmail,
      });
      alert("Please check email and log in again");
      setShowPasswordReset(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="login-container">
        <Card style={{ width: "25vw", height: "auto" }}>
          <Card.Body>
            <br />
            <Card.Title style={{ textAlign: "center", fontSize: "2rem" }}>
              Login
            </Card.Title>
            <br />

            <Form>
              <Row className="align-items-center mb-2">
                <Col>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email address"
                    className="mb-2"
                  >
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="align-items-center mb-2">
                <Col>
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Password"
                    className="mb-2"
                  >
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
                <Col xs="auto">
                  <FontAwesomeIcon
                    icon={!showPassword ? faEye : faEyeSlash}
                    style={
                      !showPassword
                        ? { paddingRight: "22px", width: "18px" }
                        : { paddingRight: "20px", width: "20px" }
                    }
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </Col>
              </Row>

              <div style={{ float: "right", paddingBottom: "5px" }}>
                <a
                  id="forgotPasswordBtn"
                  onClick={() => setShowPasswordReset(true)}
                >
                  <span>Forgot Password?</span>
                </a>
              </div>
              <br />
              <div className="login-submit-container">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={(e) => {
                    logInUser();
                    e.preventDefault();
                  }}
                >
                  Login
                </Button>
              </div>
              <div
                className="login-submit-container"
                style={{ paddingBottom: "10px" }}
              >
                <span style={{ color: "darkgray" }}>
                  New User?{" "}
                  <a href="/register">
                    <u>Sign up now</u>
                  </a>
                </span>
                <br></br>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
      <Modal
        show={showPasswordReset}
        onHide={() => setShowPasswordReset(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please enter the email belonging to your account:</p>
          <Row>
            <Col>
              <FloatingLabel controlId="floatingPassword" label="Email Address">
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </FloatingLabel>
            </Col>
            <Col
              xs="auto"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                className="mx-auto"
                variant="primary"
                type="submit"
                onClick={() => resetPassword()}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;
