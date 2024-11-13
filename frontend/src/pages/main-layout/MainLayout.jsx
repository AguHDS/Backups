import styles from "./MainModal.module.css";
/* myfiles, livechat y los demas deberian ser pages porque tienen rutas y estan dentro de este layout */

//components
import { Container } from "../../components";

//common components
import { Button } from "../../components/common";
import { useState } from "react";

export default function MainLayout() {
  const [onClose, setonClose] = useState(false);

  return (
    <Container>
      <div className="w-full">
        <div className="justify-center space-x-4 p-4 flex flex-wrap sm:flex-nowrap">
          <Button
            label="Profile"
            className="oldgrayBtn"
            id="profile-button"
          ></Button>
          <Button
            label="Live Chat"
            className="oldgrayBtn"
            id="livechat-button"
          ></Button>
          <Button
            label="My Files"
            className="oldgrayBtn"
            id="myfiles-button"
          ></Button>
          <Button
            label="Users"
            className="oldgrayBtn"
            id="close-button"
          ></Button>
        </div>
        <div className={styles.containerView}>
          <div className={styles.defaultView}>
            Click on the buttons to choose a section.
          </div>
        </div>
      </div>
    </Container>
  );
}
