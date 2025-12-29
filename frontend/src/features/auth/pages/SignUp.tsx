import type { ChangeEvent } from "react";
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
  const { setIsModalOpen } = useModalContext();
  const { input, setInput, statusMessage, handleSubmit } = useAuth();

  const handleUserChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev: AuthInput) => ({ ...prev, user: e.target.value }));
  };

  const handlePassChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev: AuthInput) => ({ ...prev, password: e.target.value }));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev: AuthInput) => ({ ...prev, email: e.target.value }));
  };

  return (
    <>
      <Modal>
        <TermsAndConditions onUnderstand={()=> setIsModalOpen(false)} />
      </Modal>
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
              <form className="overflow-hidden" onSubmit={handleSubmit}>
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
                      placeholder="username"
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
                      placeholder="email"
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
                      placeholder="password"
                      type="password"
                      name="password"
                      autoComplete="off"
                      required={true}
                    />
                  </div>
                  <ValidationMessages
                    input={input.inputsWarnings}
                    status={null}
                    message={statusMessage}
                  />
                  <div className="flex justify-center">
                    <Button
                      label="Sign up"
                      className="backupsBtn my-5"
                      type="submit"
                    />
                  </div>
                </div>
              </form>
              <div className="flex justify-between">
                <div className="relative mt-4 text-sm font-medium text-gray-500 dark:text-gray-300 self-end">
                  Have an account?
                  <Link
                    to="/sign-in"
                    className="ml-1 text-blue-700 hover:underline dark:text-blue-500"
                  >
                    Sign in
                  </Link>
                </div>
                <div className="relative mt-4 text-sm font-medium text-gray-500 dark:text-gray-300 self-end">
                  by registiring you agree with the
                  <a className="cursor-pointer ml-1 text-blue-700 hover:underline dark:text-blue-500" onClick={()=> setIsModalOpen(true)}>
                    Terms and conditions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
