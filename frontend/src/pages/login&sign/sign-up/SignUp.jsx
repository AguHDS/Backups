//components
import { NavBar } from "../../../components";
import AuthFeedback from "../authFeedback/AuthFeedback";

//common components
import { Button, Input } from "../../../components/common";

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
    <div className="modalWrapper">
      <NavBar />
      <form className="formLoginAndSign" method="post" onSubmit={handleSubmit}>
        <div>
          <h1>Sign up</h1>
          <div className="signGroup">
            <label className="signLabel" htmlFor="user_signUp">
              Name
            </label>
            <Input
              id="user_signUp"
              className="signInput"
              value={input.user}
              onChange={handleUserChange}
              name="user"
              required={false}
            />
            <div>
              <label className="signLabel" htmlFor="email_signUp">
                Email
              </label>
              <Input
                id="email_signUp"
                className="signInput"
                value={input.email}
                onChange={handleEmailChange}
                type="email"
                name="email"
                autoComplete="on"
                required={true}
              />
            </div>
            <div>
              <label className="signLabel" htmlFor="pass_signUp">
                Password
              </label>
              <Input
                id="pass_signUp"
                className="signInput"
                value={input.password}
                onChange={handlePassChange}
                type="password"
                name="password"
                required={true}
              />
            </div>
            <p className="warningsLoginAndSign" id="warning_signUp"></p>
            <AuthFeedback
              input={input.inputsWarnings}
              status={status}
              message={statusMessage}
            />
          </div>
          <Button
            label="Sign up"
            className="btn btn-primary oldgreenBtn"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
