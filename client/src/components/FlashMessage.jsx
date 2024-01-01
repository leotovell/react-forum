import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import Alert from "react-bootstrap/Alert";

function FlashMessage() {
  const [FlashMessages, setFlashMessages] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(
          "//localhost:5000/get-flash-messages"
        );
        setFlashMessages(resp.data.messages);
      } catch (error) {}
    })();
  }, []);
  return (
    <div className="flash-message-container">
      {FlashMessages.map((message) => (
        <Alert variant={message[0]} dismissible className="flash-message">
          <Alert.Heading>{message[0]}</Alert.Heading>
          <hr />
          <p>{message[1]}</p>
        </Alert>
      ))}
    </div>
  );
}

export default FlashMessage;
