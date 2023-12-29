import React, { useState } from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  (async () => {
    try {
      const resp = await httpClient.get("//localhost:5000/@me");
      navigate("/");
    } catch (error) {
      console.log("Not authenticated");
    }
  })();

  const logInUser = async () => {
    console.log(email, password);
    try {
      const resp = await httpClient.post("//localhost:5000/login", {
        email,
        password,
      });
      window.location.href = "/";
    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid Credetials (401)");
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id=""
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id=""
          />
        </div>
        <button type="button" onClick={() => logInUser()}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
