//este archivo va a ser transformado al de configuracion de la cuenta

import styles from "./Configuration.module.css";

//components
import { Container } from "../../components";

//common components
import { Button } from "../../components/common";
import { useState } from "react";

export default function Configuration() {
  const [onClose, setonClose] = useState(false);

  return (
    <Container className="flex justify-center max-w-full bg-black h-screen">
      <div className="w-[60%] h-[80%] bg-gray-700 rounded-lg shadow-lg mx-auto my-auto">
        <div className="justify-center space-x-4 p-4 flex flex-wrap sm:flex-nowrap">
          <Button
            label="Profile"
            className="oldgrayBtn"
            id="profile-button"
          ></Button>
          <Button
            label="Account settings"
            className="oldgrayBtn"
            id="livechat-button"
          ></Button>
          <Button
            label="My files"
            className="oldgrayBtn"
            id="myfiles-button"
          ></Button>
        </div>
        <div className="w-full flex justify-center bg-gray-700">
          <div className="flex-grow flex justify-center text-center text-gray-300 h-full p-4">
            Click on the buttons to choose a configuration
          </div>
        </div>
      </div>
    </Container>
  );
}
