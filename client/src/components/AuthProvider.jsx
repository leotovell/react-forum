import React, { createContext, useContext, useState, useEffect } from "react";
import httpClient from "../httpClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await httpClient.get("//localhost:5000/@me");
        if (resp.data) {
          setUser(resp.data);
        } else {
          setUser(false);
        }
      } catch (error) {
        // Handle errors if needed
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    // You can render a loading indicator or return null while data is being fetched
    return <LoadingIndicator />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Example LoadingIndicator component
const LoadingIndicator = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};
