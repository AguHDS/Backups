import styles from "./UnauthorizedWarning.module.css";

export default function UnauthorizedWarning() {
  return (
    <div className={styles.mainAdvice}>
      <div className={styles.adviceContent}>
        You must be a user to see the main content
      </div>
    </div>
  );
};
