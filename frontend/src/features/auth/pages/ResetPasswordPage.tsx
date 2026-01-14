import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Link, useSearch } from "@tanstack/react-router";
import { useResetPassword } from "../hooks/useAuthMutations";
import { Button, Input, ValidationMessages } from "@/shared";

export const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [inputsWarnings, setInputsWarnings] = useState<string[]>([]);
  const [resetSuccessful, setResetSuccessful] = useState(false);

  const navigate = useNavigate();

  const search = useSearch({ from: "/reset-password" });
  const token = search?.token || "";

  const resetPasswordMutation = useResetPassword();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);
    setInputsWarnings([]);

    if (!token) {
      setStatusMessage("Invalid reset link. No token provided.");
      return;
    }

    const errors: string[] = [];

    if (newPassword.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (newPassword !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
      setInputsWarnings(errors);
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: newPassword,
      });

      setResetSuccessful(true);
      setStatusMessage("Password reset successful!");
    } catch (error: any) {
      console.error("Reset password error:", error);

      if (error.response?.data?.error) {
        setStatusMessage(error.response.data.error);
      } else if (error.message) {
        setStatusMessage(error.message);
      } else {
        setStatusMessage("Failed to reset password. Please try again.");
      }
    }
  };

  const handleGoToLogin = () => {
    navigate({ to: "/sign-in", replace: true });
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center w-full h-[94vh]">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-6">
          <div className="h-auto bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="text-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Invalid Reset Link
              </h3>
            </div>
            <div className="p-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>

              <div className="space-y-4 mt-6">
                <Link
                  to="/forgot-password"
                  className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors"
                >
                  Request New Reset Link
                </Link>
                <Link
                  to="/sign-in"
                  className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium rounded-lg text-center transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccessful) {
    return (
      <div className="flex items-center justify-center w-full h-[94vh]">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-6">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Password Reset Successful!
            </h3>

            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Your password has been successfully updated.
            </p>

            <Button
              label="Go to Sign In"
              className="backupsBtn"
              onClick={handleGoToLogin}
            />
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
              Set New Password
            </h3>
          </div>
          <div className="py-5">
            <form
              className="overflow-hidden pl-6 pr-10"
              onSubmit={handleSubmit}
            >
              <div className="space-y-8">
                <div>
                  <label
                    className="text-sm text-gray-700 dark:text-gray-300"
                    htmlFor="new_password"
                  >
                    New Password
                  </label>
                  <Input
                    className="backupsInput my-2"
                    id="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    type="password"
                    name="newPassword"
                    required={true}
                  />
                </div>

                <div>
                  <label
                    className="text-sm text-gray-700 dark:text-gray-300"
                    htmlFor="confirm_password"
                  >
                    Confirm New Password
                  </label>
                  <Input
                    className="backupsInput my-2"
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    type="password"
                    name="confirmPassword"
                    required={true}
                  />
                </div>

                <ValidationMessages
                  input={inputsWarnings}
                  status={null}
                  message={statusMessage}
                />

                <div className="flex justify-center">
                  <Button
                    label={
                      resetPasswordMutation.isPending
                        ? "Resetting..."
                        : "Reset Password"
                    }
                    className="backupsBtn"
                    type="submit"
                    disabled={
                      resetPasswordMutation.isPending ||
                      !newPassword ||
                      !confirmPassword
                    }
                  />
                </div>
              </div>
            </form>

            <div className="relative left-[17px] pb-3 mt-4 text-sm font-medium text-gray-500 dark:text-gray-300 self-end">
              <Link
                to="/sign-in"
                className="text-blue-700 hover:underline dark:text-blue-500"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
