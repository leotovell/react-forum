import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import httpClient from "../httpClient";
import PostsFeed from "../components/PostsFeed";
import Pagination from "../components/Pagination";
import ForumBanner from "../components/ForumBanner";
import ForumPlaceholderPosts from "../components/ForumPlaceholderPosts";

const Forum = (props) => {
  const { user } = useAuth();
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

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post("//localhost:5000/api/get-forum", {
          url,
        });

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
      }
    })();
  }, []);

  return (
    <div>
      <ForumBanner
        forumName={forum.name}
        desc={forum.desc}
        forumImage={forum.image}
      />
      <ForumPlaceholderPosts />
    </div>
  );
};

export default Forum;
