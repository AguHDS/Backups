/* warnings messages for login and sign */

export default function AuthFeedback({ input, status, message }) {
  return (
    <div>
      {/* render warnings */}
      {input &&
        input.length > 0 &&
        input.map((error, index) => (
          <p key={index} className="warningsLoginAndSign">
            {error}
          </p>
        ))}

      {/* render feedback messages based on status */}
      {status !== null && (
        <p
          className={
            status >= 200 && status < 300
              ? "loginAndSignSuccesfull"
              : "warningsLoginAndSign"
          }
        >{message}</p>
      )}
    </div>
  );
}
