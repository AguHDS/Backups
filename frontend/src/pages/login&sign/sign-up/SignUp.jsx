import { Link } from "react-router-dom";

//common components
import { Button, Input, NavBar } from "../../../components/common";

//components
import AuthFeedback from "../authFeedback/AuthFeedback";

//custom hooks
import useAuth from "../../../hooks/useAuth";

export default function SignUp() {
  /*  console.log("Se esta renderizando Sign up"); */
  const { input, setInput, status, statusMessage, handleSubmit } = useAuth();

  const handleUserChange = (e) => {
    setInput((prev) => ({ ...prev, user: e.target.value }));
  };

  const handlePassChange = (e) => {
    setInput((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleEmailChange = (e) => {
    setInput((prev) => ({ ...prev, email: e.target.value }));
  };

  return (
    <>
      <NavBar />
      <div
        tabIndex="-1"
        className="flex items-center justify-center w-full min-h-screen"
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
                      tabIndex="0"
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
                      tabIndex="0"
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
                      tabIndex="0"
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
                  <AuthFeedback
                    input={input.inputsWarnings}
                    status={status}
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
              <div className="relative mt-4 text-sm font-medium text-gray-500 dark:text-gray-300 self-end">
                Have an account?
                <Link
                  to="/sign-in"
                  className="ml-1 text-blue-700 hover:underline dark:text-blue-500"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
