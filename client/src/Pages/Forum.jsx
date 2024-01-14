import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpClient from "../httpClient";
import ForumBanner from "../components/ForumBanner";
import ForumPosts from "../components/ForumPosts";
import { Container, Image, Row } from "react-bootstrap";
import sadface from "../assets/img/page/sadface.svg";
import ErrorNotice from "../components/ErrorNotice";

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
            <ErrorNotice
              title={`Whoops! Doesn't seem like theres anyone home at /${url}`}
              description={[
                "Have you got the right URL?",
                <>
                  Try <a href={`/search?v=${url}&t=forum`}>search</a> for the
                  forum instead?
                </>,
              ]}
            />
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
