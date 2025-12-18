import { ChangeEvent, KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, Input, ValidationMessages } from "@/shared";

interface AuthInput {
  user: string;
  password: string;
  email: string;
  inputsWarnings: string[];
}

export const SignIn = () => {
  const { input, setInput, status, statusMessage, handleSubmit } = useAuth();

  const handleUserChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev: AuthInput) => ({ ...prev, user: e.target.value }));
  };

  const handlePassChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev: AuthInput) => ({ ...prev, password: e.target.value }));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.form?.submit();
    }
  };

  return (
    <>
      <div
        tabIndex={-1}
        className="flex items-center justify-center w-full h-[94vh]"
      >
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-6">
          <div className="h-auto bg-white rounded-lg shadow dark:bg-gray-700">
            <div className=" text-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Log in to your account
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
                    status={status}
                    message={statusMessage}
                  />
                  <div className="flex justify-between">
                    <div className="flex items-start py-1">
                      <div className="flex items-center h-5">
                        <input
                          className="peer hidden"
                          id="remember"
                          type="checkbox"
                        />
                        <label
                          htmlFor="remember"
                          className="w-5 h-5 border-2 border-gray-500 rounded-sm cursor-pointer bg-[#1a2335] peer-checked:bg-blue-500"
                        ></label>
                      </div>
                      <label
                        htmlFor="remember"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm text-blue-700 hover:underline dark:text-blue-500"
                    >
                      Lost Password?
                    </a>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      label="Sign in"
                      className="backupsBtn"
                      onKeyDown={handleKeyDown}
                      type="submit"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="relative left-[17px] pb-3 mt-4 text-sm font-medium text-gray-500 dark:text-gray-300 self-end">
              Not registered?{" "}
              <Link
                to="/sign-up"
                className="text-blue-700 hover:underline dark:text-blue-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
