import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import {
  FloatingLabel,
  Form,
  Button,
  Card,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleMinus,
  faCircleXmark,
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import HoverTooltip from "../components/HoverTooltip";

const Register = () => {
  document.title = "LH | Register";

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordsMatch = password === confirmPassword;
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const registerUser = async () => {
    if (validUsername) {
      try {
        await httpClient.post("//localhost:5000/register", {
          email,
          username,
          password,
        });
        window.location.href = "/";
      } catch (error) {
        if (error.response.status === 409) {
          alert("User exists already.");
        } else {
          alert("Other error, contact website owner.");
        }
      }
    } else {
      alert("Username must be at least 3 characters.");
    }
  };

  const [validUsername, setValidUsername] = useState(true);
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);

  const checkUsernameValid = async (e) => {
    const username = e;
    if (username.length >= 3) {
      try {
        setUsernameCheckLoading(true);
        await httpClient.post("//localhost:5000/register-check-username", {
          username,
        });
        setUsernameCheckLoading(false);
        setValidUsername(true);
      } catch (error) {
        alert("Username taken.");
        setValidUsername(false);
      }
    } else {
      setValidUsername(false);
    }
  };

  const [usernameIcon, setUsernameIcon] = useState(
    <FontAwesomeIcon icon={faCircleMinus} />
  );

  useEffect(() => {
    if (username.length < 3) {
      setUsernameIcon(
        <HoverTooltip
          id="none-set"
          title="Ensure username is 3 characters or greater."
          styleColor="grey"
        >
          <FontAwesomeIcon icon={faCircleMinus} />
        </HoverTooltip>
      );
    } else if (usernameCheckLoading) {
      setUsernameIcon(
        <FontAwesomeIcon
          style={{ color: "grey" }}
          icon={faSpinner}
          className="fa-spin"
        />
      );
    } else if (validUsername) {
      setUsernameIcon(
        <HoverTooltip
          id="none-set"
          title="Username available"
          styleColor="green"
        >
          <FontAwesomeIcon style={{ color: "green" }} icon={faCircleCheck} />
        </HoverTooltip>
      );
    } else {
      setUsernameIcon(
        <HoverTooltip id="none-set" title="Username invalid" styleColor="red">
          <FontAwesomeIcon style={{ color: "red" }} icon={faCircleXmark} />
        </HoverTooltip>
      );
    }
  }, [validUsername, username, usernameCheckLoading]);

  return (
    <>
      <div className="login-container">
        <Card style={{ width: "25vw", height: "auto" }}>
          <Card.Body>
            <br />
            <Card.Title style={{ textAlign: "center", fontSize: "2rem" }}>
              Register
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
                  <InputGroup className="mb-2">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      style={
                        username.length < 3
                          ? { padding: "16px" }
                          : validUsername
                          ? { padding: "16px", border: "1px solid green" }
                          : { padding: "16px", border: "1px solid red" }
                      }
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (e.target.value.length !== 0) {
                          checkUsernameValid(e.target.value);
                        }
                      }}
                    />
                    <InputGroup.Text>{usernameIcon}</InputGroup.Text>
                  </InputGroup>
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
                      className={passwordsMatch ? "" : "password-no-match"}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="align-items-center mb-2">
                <Col>
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Confirm Password"
                  >
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                      className={passwordsMatch ? "" : "password-no-match"}
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

              <div
                className={
                  passwordsMatch
                    ? "password-error password-error-hidden"
                    : "password-error-active"
                }
              >
                Do not match
              </div>

              <div className="login-submit-container mb-2 pt-2">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={(e) => {
                    registerUser();
                    e.preventDefault();
                  }}
                >
                  Register
                </Button>
              </div>
              <div
                className="login-submit-container"
                style={{ paddingBottom: "10px" }}
              >
                <span style={{ color: "darkgray" }}>
                  Existing User?{" "}
                  <a href="/login">
                    <u>Log in here.</u>
                  </a>
                </span>
                <br></br>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Register;
