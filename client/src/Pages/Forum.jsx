import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpClient from "../httpClient";
import ForumBanner from "../components/ForumBanner";
import ForumPosts from "../components/ForumPosts";
import { Container, Image, Row } from "react-bootstrap";
import sadface from "../assets/img/page/sadface.svg";

const Forum = (props) => {
  const { url } = useParams();

  const [forum, setForum] = useState({
    name: "",
    desc: "",
    image: "",
  });
  const [settings, setSettings] = useState({
    public: false,
    language: "XX",
    region: "XX",
    allow_edits: false,
    allow_polls: false,
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [forumNotFound, setForumNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post("//localhost:5000/api/get-forum", {
          url,
        });
        setForumNotFound(false);

        // Update forum state
        for (const [key, value] of Object.entries(resp.data.forum)) {
          setForum((prevForum) => ({ ...prevForum, [key]: value }));
        }

        // Update settings state
        for (const [key, value] of Object.entries(resp.data.settings)) {
          setSettings((prevSettings) => ({ ...prevSettings, [key]: value }));
        }
      } catch (error) {
        // Handle the error
        setForumNotFound(true);
      } finally {
        setPageLoading(false);
      }
    })();
  }, [url]);

  return (
    <div>
      {pageLoading ? (
        // LOADER
        <div className="loader-container overlay">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          {forumNotFound ? (
            // FORUM NOT FOUND ERROR 404
            <Container fluid className="">
              <Row
                xs={5}
                className="d-flex justify-content-center align-items-center m-5"
              >
                <Image src={sadface} fluid style={{ opacity: "0.5" }} />
              </Row>
              <Row
                xs={2}
                className="d-flex justify-content-center align-items-center"
              >
                <div className="m-5">
                  <h1 style={{ textAlign: "center" }}>
                    Whoops! Doesn't seem like theres anyone home at /{url}
                  </h1>
                  <br />
                  <h4 style={{ textAlign: "center" }}>
                    Have you got the right URL?
                  </h4>
                  <h4 style={{ textAlign: "center" }}>
                    Try <a href={`/search?v=${url}&t=forum`}>search</a> for the
                    forum instead?
                  </h4>
                </div>
              </Row>
            </Container>
          ) : (
            // MAIN PAGE
            <div>
              <ForumBanner
                url={url}
                forumName={forum.name}
                desc={forum.desc}
                forumImage={forum.image}
              />
              <ForumPosts forumName settings={settings} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Forum;
