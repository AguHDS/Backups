import type { ChangeEvent } from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { useModalContext, ValidationMessages, Button, Input, TermsAndConditions, Modal } from "@/shared";

interface AuthInput {
  user: string;
  password: string;
  email: string;
  inputsWarnings: string[];
}

export const SignUp = () => {
  const { isModalOpen, setIsModalOpen } = useModalContext();
  const { input, setInput, statusMessage, handleSubmit } = useAuth();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const handleUserChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev: AuthInput) => ({ ...prev, user: e.target.value }));
  };

  const handlePassChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev: AuthInput) => ({ ...prev, password: e.target.value }));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev: AuthInput) => ({ ...prev, email: e.target.value }));
  };

  const handleTermsChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAcceptedTerms(e.target.checked);
    if (termsError) setTermsError("");
  };

  const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      setTermsError("You must accept the terms and conditions");
      return;
    }
    
    setTermsError("");
    handleSubmit(e);
  };

  const openTermsModal = (): void => {
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <Modal>
          <TermsAndConditions onUnderstand={() => setIsModalOpen(false)} />
        </Modal>
      )}
      <div
        tabIndex={0}
        className="flex items-center justify-center w-full h-[94vh]"
      >
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-6">
          <div className="h-auto bg-white rounded-lg shadow dark:bg-gray-700 relative">
            <div className="text-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Create an account
              </h3>
            </div>
            <div className="py-5 px-5">
              <form className="overflow-hidden" onSubmit={handleSignUpSubmit}>
                <div className="space-y-5">
                  <div>
                    <label
                      className="text-sm text-gray-700 dark:text-gray-300"
                      htmlFor="name_login"
                      tabIndex={0}
                    >
                      User
                    </label>
                    <Input
                      className="backupsInput my-2"
                      id="name_login"
                      value={input.user}
                      onChange={handleUserChange}
                      placeholder="Username"
                      name="user"
                      autoComplete="on"
                      required={true}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm text-gray-700 dark:text-gray-300"
                      htmlFor="email_signUp"
                      tabIndex={0}
                    >
                      Email
                    </label>
                    <Input
                      className="backupsInput my-2"
                      id="email_signUp"
                      value={input.email}
                      onChange={handleEmailChange}
                      name="email"
                      placeholder="Email"
                      autoComplete="on"
                      required={true}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm text-gray-700 dark:text-gray-300"
                      htmlFor="pass_login"
                      tabIndex={0}
                    >
                      Password
                    </label>
                    <Input
                      className="backupsInput my-2"
                      id="pass_login"
                      value={input.password}
                      onChange={handlePassChange}
                      placeholder="Password (Min. 8 characters)"
                      type="password"
                      name="password"
                      autoComplete="off"
                      required={true}
                    />
                  </div>
                  
                  <div className="flex items-start mt-4">
                    <div className="flex items-center h-5">
                      <input
                        id="terms-checkbox"
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={handleTermsChange}
                        required={true}
                      />
                    </div>
                    <div className="ms-2 top-[2px] relative">
                      <label
                        htmlFor="terms-checkbox"
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                      >
                        I have read and agree to the
                        <a
                          type="button"
                          onClick={openTermsModal}
                          className="text-blue-500 bg-inherit border-inherit font-medium rounded px-0.5"
                        >
                          {" "} Terms and Conditions
                        </a>
                      </label>
                      {termsError && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{termsError}</p>
                      )}
                    </div>
                  </div>
                  
                  <ValidationMessages
                    input={input.inputsWarnings}
                    status={null}
                    message={statusMessage}
                  />
                  <div className="flex justify-center">
                    <Button
                      label="Sign up"
                      className="backupsBtn my-5 disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={!acceptedTerms}
                    />
                  </div>
                </div>
              </form>
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Already have an account?{" "}
                  <Link
                    to="/sign-in"
                    className="text-blue-700 hover:underline dark:text-blue-500"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};