import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import PostsFeed from "../components/PostsFeed";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useAuth } from "../components/AuthProvider";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(1);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [reloadPosts, setReloadPosts] = useState(false);

  useEffect(() => {
    setIsLoadingPosts(true);
  }, [reloadPosts]);

  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const page = parseInt(new URLSearchParams(location.search).get("page") || 1);

  const [newForums, setNewForums] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(
          "//localhost:5000/api/get-new-forums"
        );
        setNewForums(resp.data.forums);
        let d = new Date(resp.data.forums[0].date);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const [popularPosts, setPopularPosts] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(
          "//localhost:5000/api/get-popular-posts"
        );
        setPopularPosts(resp.data.posts);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div>
      <Container fluid style={{ height: "100%" }}>
        {/* First Row */}
        <Row
          style={{ height: "30vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          <h1 className="text-center">Our Forum: LHub</h1>
        </Row>

        {/* Second Row with Two Columns */}
        <Row className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Col className="d-flex justify-content-center">
            <Card
              style={{ width: "20vw" }}
              className="d-flex justify-content-center align-items-center py-3"
            >
              {/* Content for the left column */}
              <div className="d-flex justify-content-center align-items-center">
                <h3>
                  <u>New Forums</u>
                </h3>
                <a href="/new">
                  <FontAwesomeIcon
                    icon={faAnglesRight}
                    className="mx-2 bouncing-icon"
                  />
                </a>
              </div>
              {newForums.map(({ name, url, date }) => (
                <li key={url} style={{ listStyle: "none" }}>
                  <a
                    style={{ textDecoration: "none", color: "black" }}
                    href={`/forum/${url}`}
                  >
                    {name}
                  </a>
                  <span style={{ color: "grey" }}>
                    {Math.round(
                      (new Date() - new Date(date)) / (24 * 60 * 60 * 1000)
                    ) == 0
                      ? " | Today"
                      : ` | ${Math.round(
                          (new Date() - new Date(date)) / (24 * 60 * 60 * 1000)
                        )}d ago`}
                  </span>
                </li>
              ))}
            </Card>
          </Col>
          <Col className="d-flex justify-content-center">
            <Card
              style={{ width: "20vw" }}
              className="d-flex justify-content-center align-items-center py-3"
            >
              {/* Content for the right column */}
              <div className="d-flex justify-content-center align-items-center">
                <h3>
                  <u>Trending Posts</u>
                </h3>
                <a href="/trending">
                  <FontAwesomeIcon
                    icon={faAnglesRight}
                    className="mx-2 bouncing-icon"
                  />
                </a>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
