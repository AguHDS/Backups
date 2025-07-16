import styles from "./feedbackMessages.module.css";

interface Props {
  input: string[];
  status: number | null;
  message: string | null;
}

// Render feedbacks and warnings in forms

export const FeedbackMessages = ({ input, status, message }: Props) => {
  return (
    <div>
      {/* render warnings */}
      {input &&
        input.length > 0 &&
        input.map((error, index) => (
          <p key={index} className={styles.warningsLoginAndSign}>
            {error}
          </p>
        ))}

      {/* Render feedback messages based on status */}
      {status !== null && (
        <p
          className={
            status >= 200 && status < 300
              ? `${styles.loginAndSignSuccesfull}`
              : `${styles.warningsLoginAndSign}`
          }
        >{message}</p>
      )}
    </div>
  );
}
