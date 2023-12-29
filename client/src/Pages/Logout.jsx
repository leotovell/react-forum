import React from "react";
import httpClient from "../httpClient";

const Logout = () => {
  const logoutUser = async () => {
    const resp = await httpClient.post("//localhost:5000/logout");
    window.location.href = "/";
  };
  logoutUser();
  return <div>Logging Out...</div>;
};

export default Logout;
