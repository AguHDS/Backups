import styles from "./AccountOptions.module.css";

//components
import Button from "../../common/Buttons/Button";

export default function AccountOptions() {
  return (
    <div className={styles.accountContainer}>
      <Button
        label={"Logged as "}
        className={`btn btn-primary oldgreenBtn`}
        id="profile-btn"
      ></Button>
      <p className={styles.username} id="username"></p>
      <div className={styles.dropdownContent} id="dropdown-account-content">
        <Button label="Logout" className={styles.dropdownLogout}></Button>
      </div>
    </div>
  );
}
