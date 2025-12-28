interface Props {
  input: string[];
  status: number | null;
  message: string | null;
}

/**
 * Renders validation and warnings for forms
 * Can be used along with processErrorMessages utility
 */
export const ValidationMessages = ({ input, status, message }: Props) => {
  const hasInputWarnings = input && input.length > 0;
  const hasMessage = message !== null && message !== "";

  if (!hasInputWarnings && !hasMessage) {
    return null;
  }

  return (
    <div>
      {/* Render warnings from input validation */}
      {hasInputWarnings &&
        input.map((error, index) => (
          <p
            key={`input-${index}`}
            className="flex justify-center text-center text-red-600 mb-0 relative"
          >
            {error}
          </p>
        ))}

      {/* Render API feedback messages */}
      {hasMessage && (
        <p
          className={
            status !== null && status >= 200 && status < 300
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
