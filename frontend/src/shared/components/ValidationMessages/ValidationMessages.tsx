interface Props {
  input: string[];
  status: number | null;
  message: string | null;
}

/**
 * Render validation and warnings for forms
 */
export const ValidationMessages = ({ input, status, message }: Props) => {
  return (
    <div>
      {/* render warnings */}
      {input &&
        input.length > 0 &&
        input.map((error, index) => (
          <p
            key={index}
            className="flex justify-center text-center text-red-600 mb-0 relative"
          >
            {error}
          </p>
        ))}

      {/* Render feedback messages based on status */}
      {status !== null && (
        <p
          className={
            status >= 200 && status < 300
              ? "flex justify-center text-green-600 mb-0 relative"
              : "flex justify-center text-center text-red-600 mb-0 relative"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};
