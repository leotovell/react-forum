import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import httpClient from "../httpClient";

const Profile = (props) => {
  const tempID = useParams();
  const [id, setId] = useState(tempID.id);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const navigate = useNavigate();

  setInterval(() => {
    setAlertVisible(true);
  }, 5000);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post("//localhost:5000/profile", {
          id,
        });
        setProfileData(resp.data);
        setIsLoading(false);
      } catch (error) {
        console.log("User not found");
        (async () => {
          try {
            const resp = await httpClient.get("//localhost:5000/@me");
            setId(resp.data.id);
            setIsLoggedIn(true);
            setIsOwnProfile(true);
          } catch (error) {
            console.log("Not authenticated");
            navigate("/login");
          }
        })();
      }
    })();
  }, [isLoggedIn]);

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
      ) : (
        <h1>{profileData.email}</h1>
      )}
    </div>
  );
};

export default Profile;
