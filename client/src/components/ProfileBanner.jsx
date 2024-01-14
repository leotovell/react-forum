import React, { useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Image,
  Overlay,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useAuth } from "./AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import defaultPFP from "../assets/img/default/qmark.png";
import HoverTooltip from "../components/HoverTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCalendarPlus,
  faSignsPost,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

function ProfileBanner({
  id,
  username,
  bio,
  date_joined,
  posts,
  image,
  style,
  self,
  url,
}) {
  console.log(date_joined);
  const handleFollow = async () => {
    console.log("Follow user");
  };

  const handleMessage = async () => {
    console.log("Message user | Coming Soon");
  };

  const handleShare = async () => {
    console.log("Share user");
  };
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showId, setShowId] = useState(false);
  const usernameRef = useRef(null);

  return (
    <div className="forum-banner" style={style}>
      <Container fluid>
        <Row>
          <Col
            xs={4}
            md={3}
            className="forum-image d-flex flex-column justify-content-center align-items-center"
          >
            <Image src={image} fluid />
          </Col>
          <Col xs={4} md={6} className="forum-title-desc">
            <h1 className="forum-title">{username}</h1>

            <h3 className="forum-desc">{bio}</h3>
          </Col>
          <Col
            xs={3}
            md={2}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div
                className="d-flex align-items-center"
                style={{ fontSize: "50%" }}
              >
                <FontAwesomeIcon className="my-2" icon={faUsers} />
                <span className="mx-2">20</span>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ fontSize: "50%" }}
              >
                <FontAwesomeIcon className="my-2" icon={faSignsPost} />
                <span className="mx-2">{posts.length}</span>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ fontSize: "50%" }}
              >
                <FontAwesomeIcon className="my-2" icon={faCalendarPlus} />
                <span className="mx-2">
                  {new Date(date_joined).toLocaleDateString()}{" "}
                </span>
              </div>
            </div>
          </Col>
          <Col
            xs={1}
            md={1}
            className="buttons d-flex flex-column justify-content-center"
          >
            {user.id !== id &&
              (user ? (
                <Button className="my-2" onClick={handleFollow}>
                  Follow
                </Button>
              ) : (
                <Button
                  className="my-2"
                  onClick={() => navigate(`/login?redirect=/profile/${url}`)}
                >
                  Login to Follow
                </Button>
              ))}

            <Button disabled className="my-2" onClick={handleMessage}>
              Message (Coming Soon)
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

ProfileBanner.defaultProps = {
  style: {},
  self: false,
  image: defaultPFP,
  bio: <i>This user has not set a personal bio</i>,
};

export default ProfileBanner;
