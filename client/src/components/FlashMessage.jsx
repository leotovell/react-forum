import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";

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
    <div>
      <ul>
        {FlashMessages.map((message) => (
          <li>
            <p>{message[0]}</p>
            <p>{message[1]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FlashMessage;
