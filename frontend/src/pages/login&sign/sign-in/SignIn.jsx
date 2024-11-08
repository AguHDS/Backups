//components
import { NavBar } from "../../../components";
import AuthFeedback from "../authFeedback/AuthFeedback";

//common components
import { Button, Input } from "../../../components/common";

//custom hooks
import { useAuth } from "../../../hooks";

export default function SignIn() {
/*   console.log("montando sign in"); */
  const { input, setInput, status, statusMessage, handleSubmit } = useAuth();

  const handleUserChange = (e) => {
    setInput((prev) => ({ ...prev, user: e.target.value }));
  };

  const handlePassChange = (e) => {
    setInput((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.form.submit();
    }
  };

  return (
    <div className="modalWrapper">
      <NavBar />
      <form className="formLoginAndSign" method="post" onSubmit={handleSubmit}>
        <div>
          <h1 id="login-title">Login</h1>
          <div className="signGroup">
            <label className="signLabel" htmlFor="name_login">
              User
            </label>
            <Input
              id="name_login"
              className="signInput"
              value={input.user}
              onChange={handleUserChange}
              name="user"
              autoComplete="on"
              required={true}
            />
            <div>
              <label className="signLabel" htmlFor="pass_login">
                Password
              </label>
              <Input
                id="pass_login"
                className="signInput"
                value={input.password}
                onChange={handlePassChange}
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
          </div>
          <Button
            label="Sign in"
            onKeyDown={handleKeyDown}
            className="btn btn-primary oldgreenBtn"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
