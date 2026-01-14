import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useRequestPasswordReset } from "../hooks/useAuthMutations";
import { Button, Input, ValidationMessages } from "@/shared";

export const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [inputsWarnings, setInputsWarnings] = useState<string[]>([]);

  const requestPasswordResetMutation = useRequestPasswordReset();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);
    setInputsWarnings([]);

    if (!email.trim()) {
      setInputsWarnings(["Email is required"]);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setInputsWarnings(["Please enter a valid email address"]);
      return;
    }

    try {
      await requestPasswordResetMutation.mutateAsync({ email });
      setSubmitted(true);
    } catch (error: any) {
      console.error("Error requesting password reset:", error);

      if (error.response?.data?.error) {
        setStatusMessage(error.response.data.error);
      } else if (error.message) {
        setStatusMessage(error.message);
      } else {
        setStatusMessage("Failed to send reset email. Please try again.");
      }
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center w-full h-[94vh]">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-6">
          <div className="h-auto bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="text-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Check Your Email
              </h3>
            </div>
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If an account exists with the email{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {email}
                </span>
                , you will receive a password reset link shortly.
              </p>
              <div className="space-y-4">
                <Link
                  to="/sign-in"
                  className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors"
                >
                  Back to Sign In
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-[94vh]">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-6">
        <div className="h-auto bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="text-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Reset Your Password
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  className="block text-sm text-gray-700 dark:text-gray-300 mb-2"
                  htmlFor="email_reset"
                >
                  Email Address
                </label>
                <Input
                  className="backupsInput w-full"
                  id="email_reset"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  name="email"
                  required={true}
                />
              </div>

              <ValidationMessages
                input={inputsWarnings}
                status={null}
                message={statusMessage}
              />

              <div className="space-y-4">
                <Button
                  label={
                    requestPasswordResetMutation.isPending
                      ? "Sending..."
                      : "Send Reset Link"
                  }
                  className="backupsBtn w-full"
                  type="submit"
                  disabled={requestPasswordResetMutation.isPending}
                />

                <div className="text-center">
                  <Link
                    to="/sign-in"
                    className="text-sm text-blue-700 hover:underline dark:text-blue-500"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
