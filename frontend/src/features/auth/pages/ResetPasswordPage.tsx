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

      setStatusMessage("Password reset successful! Redirecting to login...");

      setTimeout(() => {
        navigate({ to: "/sign-in", replace: true });
      }, 3000);
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
            <div className="p-6 text-center">
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

              <p className="text-gray-700 dark:text-gray-300 mb-6">
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

  return (
    <div className="flex items-center justify-center w-full h-[94vh]">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-6">
        <div className="h-auto bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="text-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Set New Password
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm text-gray-700 dark:text-gray-300 mb-2"
                    htmlFor="new_password"
                  >
                    New Password
                  </label>
                  <Input
                    className="backupsInput w-full"
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
                    className="block text-sm text-gray-700 dark:text-gray-300 mb-2"
                    htmlFor="confirm_password"
                  >
                    Confirm New Password
                  </label>
                  <Input
                    className="backupsInput w-full"
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    type="password"
                    name="confirmPassword"
                    required={true}
                  />
                </div>
              </div>

              <ValidationMessages
                input={inputsWarnings}
                status={null}
                message={statusMessage}
              />

              <div className="space-y-4 mt-6">
                <Button
                  label={
                    resetPasswordMutation.isPending
                      ? "Resetting..."
                      : "Reset Password"
                  }
                  className="backupsBtn w-full"
                  type="submit"
                  disabled={
                    resetPasswordMutation.isPending ||
                    !newPassword ||
                    !confirmPassword
                  }
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
