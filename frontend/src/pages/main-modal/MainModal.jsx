import styles from "./MainModal.module.css";

//components
import { Modal } from "../../components";

//common components
import { Button } from "../../components/common";
import { useState } from "react";

export default function MainModal() {
  const [onClose, setonClose] = useState(false);


  return (
    <Modal>
      <div className={styles.buttonContainer}>
        <Button
          label="Profile"
          className="btn btn-primary oldgrayBtn"
          id="profile-button"
        ></Button>
        <Button
          label="Live Chat"
          className="btn btn-primary  oldgrayBtn"
          id="livechat-button"
        ></Button>
        <Button
          label="My Files"
          className="btn btn-primary oldgrayBtn"
          id="myfiles-button"
        ></Button>
        <Button
          label="Users"
          className="btn btn-primary oldgrayBtn"
          id="close-button"
        ></Button>
      </div>
      <div className={styles.containerView}>
        <div className={styles.defaultView}>
          Click on the buttons to choose a section.
        </div>
      </div>
    </Modal>
  );
}
