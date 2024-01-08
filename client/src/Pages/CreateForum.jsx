import React, { useEffect, useRef, useState } from "react";
import httpClient from "../httpClient";
import { useAuth } from "../components/AuthProvider";
import { Form, InputGroup, Overlay } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import PhotoUploadCropper from "../components/PhotoUploadCropper";
import Tooltip from "react-bootstrap/Tooltip";
import {
  faCircleMinus,
  faSpinner,
  faCircleCheck,
  faCircleXmark,
  faCircleQuestion,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Image from "react-bootstrap/Image";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ForumPreview from "../components/ForumPreview";
import Accordion from "react-bootstrap/Accordion";
import { useNavigate } from "react-router-dom";

const CreateForum = () => {
  const { user } = useAuth();
  const urlRef = useRef(null);
  const submitRef = useRef(null);
  const navigate = useNavigate();
  const [forumName, setForumName] = useState("");
  const [description, setDescription] = useState();
  const [region, setRegion] = useState("XX");
  const [regions, setRegions] = useState([]);
  const [language, setLanguage] = useState("en");
  const [languages, setLanguages] = useState([]);
  const [vanityUrl, setVanityUrl] = useState("");
  const [vanityUrlValid, setVanityUrlValid] = useState(false);
  const [forumNameValid, setForumNameValid] = useState(true);
  const [forumSettings, setForumSettings] = useState({
    public: true,
    allow_edits: true,
    allow_polls: true,
  });
  const [illegalCharacters, setIllegalCharacters] = useState([]);
  const [errors, setErrors] = useState([]);

  const imageContext = require.context(
    "../assets/img/default",
    false,
    /\.(png)$/
  );

  const imagePaths = imageContext.keys();
  const imageUrls = imagePaths.map((path) => imageContext(path));

  const [forumPictureUrl, setForumPictureUrl] = useState(imageUrls[0]);
  const [forumPicture, setForumPicture] = useState(null);

  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("//localhost:5000/get-country-codes");
        setRegions(resp.data.codes);
      } catch (error) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(
          "//localhost:5000/get-language-codes"
        );
        setLanguages(resp.data.codes);
      } catch (error) {}
    })();
  }, []);

  const [pulsing, setPulsing] = useState(false);
  useEffect(() => {
    // Set the condition that triggers the pulsing effect
    let timeoutId;
    if (errors.length > 0) {
      setPulsing(true);

      // Set a timeout to remove the pulsing effect after a certain duration
      timeoutId = setTimeout(() => {
        setPulsing(false);
      }, 1000); // Adjust the duration as needed
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [errors]);

  const submitForum = async () => {
    // Validate ALL required fields are filled in.
    let currentErrors = [];
    if (forumName.length < 3) {
      currentErrors.push("Forum name is too short");
    }
    if (!forumNameValid) {
      currentErrors.push("Forum name is invalid");
    }
    if (vanityUrl.length < 3) {
      currentErrors.push("Vanity URL is too short");
    }
    if (!vanityUrlValid) {
      currentErrors.push("Vanity URL is invalid");
    }
    if (!description) {
      currentErrors.push("Description cannot be blank");
    }
    setErrors([...currentErrors]);
    if (currentErrors.length == 0)
      try {
        await httpClient.post("//localhost:5000/create-forum", {
          forumName,
          vanityUrl,
          // Settings
          description,
          language,
          region,
          forumSettings,
        });
        //   window.location.href = "/";
        navigate("/");
      } catch (error) {
        alert("error creating Forum");
      }
  };

  const URLRegex = /[^a-zA-Z0-9_-]/g;
  const checkURLRegex = (url) => {
    const match = url.match(URLRegex);
    if (match) {
      setIllegalCharacters(match);
    } else {
      setIllegalCharacters([]);
    }
    return match ? false : true;
  };

  const [vanityUrlCheckLoading, setVanityUrlCheckLoading] = useState(false);
  const checkVanityUrl = async (e) => {
    const url = e;
    let res;

    if (checkURLRegex(e) && url.length >= 3) {
      try {
        setVanityUrlCheckLoading(true);
        const resp = await httpClient.post(
          "//localhost:5000/check-vanity-url",
          {
            url,
          }
        );
        setVanityUrlValid(!resp.data.exists);
        setVanityUrlCheckLoading(false);
      } catch (error) {
        setVanityUrlValid(false);
      }
    } else {
      setVanityUrlValid(false);
    }
  };

  const [forumNameCheckLoading, setForumNameCheckLoading] = useState(false);
  const checkForumName = async (e) => {
    const name = e;
    if (name.length >= 3) {
      try {
        setForumNameCheckLoading(true);
        const resp = await httpClient.post(
          "//localhost:5000/check-forum-name",
          {
            name,
          }
        );
        setForumNameValid(!resp.data.exists);
        setForumNameCheckLoading(false);
      } catch (error) {
        setForumNameValid(false);
      }
    } else {
      setForumNameValid(false);
    }
  };

  const Link = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      <button
        style={{ all: "unset", color: "grey", cursor: "help" }}
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </button>
    </OverlayTrigger>
  );

  const [vanityIcon, setVanityIcon] = useState(
    <FontAwesomeIcon icon={faCircleMinus} />
  );

  useEffect(() => {
    if (vanityUrl.length < 3 && illegalCharacters.length == 0) {
      setVanityIcon(
        <Link
          id="none-set"
          title="Ensure url is 3 characters or greater. May only contain a-z, 0-9, _ and -"
        >
          <FontAwesomeIcon icon={faCircleMinus} />
        </Link>
      );
    } else if (vanityUrlCheckLoading && illegalCharacters.length == 0) {
      setVanityIcon(
        <FontAwesomeIcon
          style={{ color: "grey" }}
          icon={faSpinner}
          className="fa-spin"
        />
      );
    } else if (vanityUrlValid && illegalCharacters.length == 0) {
      setVanityIcon(
        <FontAwesomeIcon style={{ color: "green" }} icon={faCircleCheck} />
      );
    } else {
      setVanityIcon(
        <FontAwesomeIcon style={{ color: "red" }} icon={faCircleXmark} />
      );
    }
  }, [vanityUrlValid, vanityUrl, vanityUrlCheckLoading]);

  const [forumNameIcon, setForumNameIcon] = useState(
    <FontAwesomeIcon icon={faCircleMinus} />
  );

  useEffect(() => {
    if (forumName.length < 3) {
      setForumNameIcon(
        <Link
          id="none-set"
          title="Ensure forum name is 3 characters or greater."
        >
          <FontAwesomeIcon icon={faCircleMinus} />
        </Link>
      );
    } else if (forumNameCheckLoading) {
      setForumNameIcon(
        <FontAwesomeIcon
          style={{ color: "grey" }}
          icon={faSpinner}
          className="fa-spin"
        />
      );
    } else if (forumNameValid) {
      setForumNameIcon(
        <FontAwesomeIcon style={{ color: "green" }} icon={faCircleCheck} />
      );
    } else {
      setForumNameIcon(
        <FontAwesomeIcon style={{ color: "red" }} icon={faCircleXmark} />
      );
    }
  }, [forumNameValid, forumName, forumNameCheckLoading]);

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      var reader = new FileReader();
      reader.onloadend = () => {
        setForumPicture(reader.result);
        setIsCustomPhotoUploaded(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const [isCustomPhotoUploaded, setIsCustomPhotoUploaded] = useState(false);

  return (
    <div>
      <h1>Create a new Forum!</h1>

      <Tabs
        defaultActiveKey="edit"
        id="forum-create-tabs"
        className="mb-2"
        fill
      >
        <Tab
          eventKey="edit"
          title="Edit"
          style={{ marginBottom: "0 !important" }}
        >
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>General</Accordion.Header>
              <Accordion.Body>
                <Form style={{ margin: "20px" }}>
                  <Row className="align-items-center">
                    <Col>
                      <Form.Label>
                        Your Forum Name{" "}
                        <Link
                          id="t-1"
                          title={"Must be 3 characters or greater"}
                        >
                          <FontAwesomeIcon icon={faCircleQuestion} />
                        </Link>
                      </Form.Label>
                      <InputGroup className="mb-2">
                        <Form.Control
                          aria-describedby="basic-addon3"
                          value={forumName}
                          onChange={(e) => {
                            setForumName(e.target.value);
                            checkForumName(e.target.value);
                          }}
                          style={
                            forumName.length < 3
                              ? {}
                              : forumNameCheckLoading
                              ? {}
                              : forumNameValid
                              ? { border: "1px solid green" }
                              : { border: "1px solid red" }
                          }
                        />
                        <InputGroup.Text>{forumNameIcon}</InputGroup.Text>
                      </InputGroup>

                      <Form.Label>
                        Your vanity URL{" "}
                        <Link
                          id="t-1"
                          title={"Must be 3 characters or greater"}
                        >
                          <FontAwesomeIcon icon={faCircleQuestion} />
                        </Link>
                      </Form.Label>
                      <InputGroup className="mb-2">
                        <InputGroup.Text id="basic-addon3">
                          https://forum.leotovell.co.uk/forum/
                        </InputGroup.Text>
                        <Form.Control
                          ref={urlRef}
                          id="basic-url"
                          aria-describedby="basic-addon3"
                          value={vanityUrl}
                          onChange={(e) => {
                            setVanityUrl(e.target.value);
                            checkVanityUrl(e.target.value);
                          }}
                          style={
                            vanityUrl.length < 3 &&
                            illegalCharacters.length == 0
                              ? {}
                              : vanityUrlCheckLoading &&
                                illegalCharacters.length == 0
                              ? {}
                              : vanityUrlValid && illegalCharacters.length == 0
                              ? { border: "1px solid green" }
                              : { border: "1px solid red" }
                          }
                        />
                        <Overlay
                          target={urlRef.current}
                          show={illegalCharacters.length > 0}
                          placement="bottom"
                        >
                          {(props) => (
                            <Tooltip id="overlay-example" {...props}>
                              Cannot contain: {illegalCharacters.join(" ")}
                            </Tooltip>
                          )}
                        </Overlay>
                        <InputGroup.Text>{vanityIcon}</InputGroup.Text>
                      </InputGroup>
                    </Col>

                    <Col xs="auto">
                      <Form.Label>Your Forum Photo</Form.Label>
                      <DropdownButton
                        className="mb-2"
                        id="photo-dropdown"
                        title="Preset Photos"
                      >
                        <div
                          className="d-flex flex-wrap"
                          style={{ paddingLeft: "10px" }}
                        >
                          {imageUrls.map((url, index) => (
                            <Dropdown.Item
                              key={index}
                              // className="mx-2 my-2 d-flex align-items-center"
                              style={{ display: "contents" }}
                              onClick={() => setForumPictureUrl(url)}
                            >
                              <Image
                                src={url}
                                width={"20%"}
                                style={{ margin: "2px" }}
                              />
                            </Dropdown.Item>
                          ))}
                        </div>
                      </DropdownButton>
                      <Button
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        Upload Custom Photo
                      </Button>
                      <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e)}
                        accept="image/png"
                      ></input>
                      <PhotoUploadCropper
                        // https://www.npmjs.com/package/react-avatar-editor
                        imgUrl={forumPicture}
                        show={isCustomPhotoUploaded}
                        setShow={setIsCustomPhotoUploaded}
                        saveImage={setForumPictureUrl}
                      />
                    </Col>
                    <Col xs="auto">
                      <input hidden type="file" />
                      <div className="container-forum-image-preview">
                        <Image
                          className="forum-image-preview"
                          roundedCircle
                          src={forumPictureUrl}
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                          width={"100px"}
                          height="100px"
                        />
                        <div className="middle">
                          <FontAwesomeIcon icon={faUpload} />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Form.Label>Forum Description</Form.Label>
                  <InputGroup className="mb-2">
                    <Form.Control
                      as="textarea"
                      aria-label="With textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </InputGroup>
                  <Row>
                    <Col>
                      <Form.Label>Forum Region</Form.Label>
                      <InputGroup>
                        <Form.Select
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                        >
                          {regions.length === 0 ? (
                            <option>Loading...</option>
                          ) : (
                            regions.map((region) => (
                              <option key={region[0]} value={region[0]}>
                                {region[1]}
                              </option>
                            ))
                          )}
                        </Form.Select>
                      </InputGroup>
                    </Col>
                    <Col>
                      <Form.Label>Forum Language</Form.Label>
                      <InputGroup className="mb-2">
                        <Form.Select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          {languages.length === 0 ? (
                            <option>Loading...</option>
                          ) : (
                            languages.map((language, index) => (
                              <option key={index} value={language[0]}>
                                {language[1]}
                              </option>
                            ))
                          )}
                        </Form.Select>
                      </InputGroup>
                    </Col>
                  </Row>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Settings</Accordion.Header>
              <Accordion.Body>
                <Form>
                  <Row>
                    <Col xs="auto">
                      <Form.Label>Public Forum?</Form.Label>
                      <Form.Check
                        type="switch"
                        label={forumSettings.public ? "Public" : "Private"}
                        onChange={(e) =>
                          setForumSettings({
                            ...forumSettings,
                            public: e.target.checked,
                          })
                        }
                        checked={forumSettings.public}
                      ></Form.Check>
                    </Col>
                    <Col xs="auto">
                      <Form.Label>Allow Edits?</Form.Label>
                      <Form.Check
                        type="switch"
                        label={forumSettings.allow_edits ? "True" : "False"}
                        onChange={(e) =>
                          setForumSettings({
                            ...forumSettings,
                            allow_edits: e.target.checked,
                          })
                        }
                        checked={forumSettings.allow_edits}
                      ></Form.Check>
                    </Col>
                    <Col xs="auto">
                      <Form.Label>Allow Polls?</Form.Label>
                      <Form.Check
                        type="switch"
                        label={forumSettings.allow_polls ? "True" : "False"}
                        onChange={(e) =>
                          setForumSettings({
                            ...forumSettings,
                            allow_polls: e.target.checked,
                          })
                        }
                        checked={forumSettings.allow_polls}
                      ></Form.Check>
                    </Col>
                  </Row>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Admins + Moderators</Accordion.Header>
              <Accordion.Body>
                <i>
                  Ability to set mods is enabled shortly after forum setup...
                </i>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Tab>
        <Tab eventKey="preview" title="Preview">
          <ForumPreview
            forumName={forumName}
            setForumName={setForumName}
            forumImage={forumPictureUrl}
            desc={description}
            setDescription={setDescription}
            preview={true}
          />
        </Tab>
      </Tabs>
      <Button
        ref={submitRef}
        onClick={submitForum}
        variant="primary"
        className={pulsing ? "pulse" : "wiggle"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          boxShadow: "rgba(0, 0, 0, 0.2) 9px 5px 6px 1px", // Add drop shadow
          // You can add more styles as needed
        }}
      >
        Create Forum
      </Button>
      <Overlay
        target={submitRef.current}
        show={errors.length > 0}
        placement="left"
      >
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <u>Fix errors</u>
            {errors.map((error, idx) => (
              <li>{error}</li>
            ))}
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
};

export default CreateForum;
