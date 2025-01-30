import styles from "./AuthFeedback.module.css";

interface Props {
  input: string[];
  status: number | null;
  message: string | null;
}

/* warnings messages for login and sign */

export default function AuthFeedback({ input, status, message }: Props) {
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

      {/* render feedback messages based on status */}
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
