import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import { useAuth } from "../components/AuthProvider";
import { Form, InputGroup } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const CreateForum = () => {
  const { user } = useAuth();
  const [forumName, setForumName] = useState("");
  const [visibility, setVisibility] = useState();
  const [description, setDescription] = useState();
  const [region, setRegion] = useState("XX");
  const [regions, setRegions] = useState([]);
  const [langauge, setLanguage] = useState("en");
  const [languages, setLanguages] = useState([]);
  const [vanityUrl, setVanityUrl] = useState("");
  const [vanityUrlValid, setVanityUrlValid] = useState(false);
  const [forumNameValid, setForumNameValid] = useState(true);

  //   useEffect(() => {
  //     (async () => {
  //       try {
  //         const resp = await httpClient.get("//localhost:5000/get-country-codes");
  //         setRegions(resp.data.codes);
  //       } catch (error) {}
  //     })();
  //   }, []);

  //   useEffect(() => {
  //     (async () => {
  //       try {
  //         const resp = await httpClient.get(
  //           "//localhost:5000/get-language-codes"
  //         );
  //         setLanguages(resp.data.codes);
  //       } catch (error) {}
  //     })();
  //   }, []);

  const submitForum = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/create-forum", {
        forumName,
        // Settings
        visibility,
      });
      //   window.location.href = "/";
      alert("success");
    } catch (error) {
      alert("error creating Forum");
    }
  };

  const [vanityUrlCheckLoading, setVanityUrlCheckLoading] = useState(false);
  const checkVanityUrl = async (e) => {
    const url = e;
    if (url.length >= 3) {
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
      <a href="#" style={{ color: "grey", cursor: "help" }}>
        {children}
      </a>
    </OverlayTrigger>
  );

  const [vanityIcon, setVanityIcon] = useState(
    <FontAwesomeIcon icon={faCircleMinus} />
  );

  useEffect(() => {
    if (vanityUrl.length < 3) {
      setVanityIcon(<FontAwesomeIcon icon={faCircleMinus} />);
    } else if (vanityUrlCheckLoading) {
      setVanityIcon(
        <FontAwesomeIcon
          style={{ color: "grey" }}
          icon={faSpinner}
          className="fa-spin"
        />
      );
    } else if (vanityUrlValid) {
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
      setForumNameIcon(<FontAwesomeIcon icon={faCircleMinus} />);
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

  return (
    <div>
      <h1>Create a new Forum!</h1>

      <Form style={{ margin: "20px" }}>
        <Form.Label>
          Your Forum Name{" "}
          <Link id="t-1" title={"Must be 3 characters or greater"}>
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
          <Link id="t-1" title={"Must be 3 characters or greater"}>
            <FontAwesomeIcon icon={faCircleQuestion} />
          </Link>
        </Form.Label>
        <InputGroup className="mb-2">
          <InputGroup.Text id="basic-addon3">
            https://forum.leotovell.co.uk/forum/
          </InputGroup.Text>
          <Form.Control
            id="basic-url"
            aria-describedby="basic-addon3"
            value={vanityUrl}
            onChange={(e) => {
              setVanityUrl(e.target.value);
              checkVanityUrl(e.target.value);
            }}
            style={
              vanityUrl.length < 3
                ? {}
                : vanityUrlCheckLoading
                ? {}
                : vanityUrlValid
                ? { border: "1px solid green" }
                : { border: "1px solid red" }
            }
          />
          <InputGroup.Text>{vanityIcon}</InputGroup.Text>
        </InputGroup>

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
                menuPlacement="bottom"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {regions.length == 0 ? (
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
                menuPlacement="bottom"
                value={langauge}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.length == 0 ? (
                  <option>Loading...</option>
                ) : (
                  languages.map((language) => (
                    <option key={language[0]} value={language[0]}>
                      {language[1]}
                    </option>
                  ))
                )}
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateForum;
