import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import httpClient from "../httpClient";
import { useAuth } from "../components/AuthProvider";
import ErrorNotice from "../components/ErrorNotice";
import ProfileBanner from "../components/ProfileBanner";
import PostsFeed from "../components/PostsFeed";

const Profile = (props) => {
  const { user } = useAuth();
  const tempID = useParams();
  const [id, setId] = useState(tempID.id);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState();
  const [profileNotFound, setProfileNotFound] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        let searchID = id;
        setIsLoading(true);
        if (user && !id) {
          setIsOwnProfile(true);
          searchID = user.id;
        }

        const resp = await httpClient.post("//localhost:5000/api/profile", {
          id: searchID,
        });
        setProfile(resp.data);
      } catch (error) {
        setProfileNotFound(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  return (
    <div>
      {isLoading ? (
        <div className="loader-container overlay">
          <div className="loader"></div>
          <span className={!alertVisible ? "hidden" : ""}>
            Still waiting? Refresh or contact web admin, quoting error in
            console.
          </span>
        </div>
      ) : profileNotFound ? (
        <ErrorNotice
          title="Hmmm, that profile doesnt exist..."
          description={[
            "Check you have the right URL",
            <>
              Try <a href={`/search?v=&t=user`}>search</a> for the user instead?
            </>,
          ]}
        />
      ) : (
        <>
          <ProfileBanner {...profile} />
          <PostsFeed posts={profile.posts} />
        </>
      )}
    </div>
  );
};

export default Profile;
