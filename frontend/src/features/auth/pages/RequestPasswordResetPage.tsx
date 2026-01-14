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
          <div className="bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex flex-col items-center pt-6 gap-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Check Your Email
              </h3>

              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="h-7 w-7 text-green-600 dark:text-green-400"
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
            </div>

            <div className="p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If an account exists with the email{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {email}
                </span>
                , you will receive a password reset link shortly.
              </p>

              <div className="space-y-3">
                <div className="flex justify-center">
                  <Link
                    to="/sign-in"
                    className="text-sm text-blue-700 hover:underline dark:text-blue-500"
                  >
                    Back to Sign In
                  </Link>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the email?{" "}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-blue-700 cursor-pointer hover:underline dark:text-blue-500 bg-transparent border-0"
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
        <div className="bg-white p-10 rounded-lg shadow dark:bg-gray-700">

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Reset Your Password
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-gray-600 relative bottom-2 dark:text-gray-400 text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full space-y-4"
            >
              <div className="w-full max-w-xs">
                <label
                  className="flex justify-center text-sm text-gray-700 dark:text-gray-300 mb-2"
                  htmlFor="email_reset"
                >
                  Email Address
                </label>
                <Input
                  className="backupsInput w-full"
                  id="email_reset"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  required
                />
              </div>

              <ValidationMessages
                input={inputsWarnings}
                status={null}
                message={statusMessage}
              />

              <div className="w-full max-w-xs flex flex-col items-center space-y-3">
                <Button
                  label={
                    requestPasswordResetMutation.isPending
                      ? "Sending..."
                      : "Send Link"
                  }
                  className="backupsBtn"
                  type="submit"
                  disabled={requestPasswordResetMutation.isPending}
                />

                <Link
                  to="/sign-in"
                  className="text-sm pt-4 text-blue-700 hover:underline dark:text-blue-500"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
