import { Link } from "react-router-dom";

//assets
import collapseIcon from "../../assets/collapse-icon.png";

//components
import AccountOptions from "./account-options/AccountOptions";

//common components
import { Button } from "../common";

export default function NavBar() {
  return (
    <>
      <nav className="backupsColor h-auto fixed top-0 w-full flex flex-col shadow-[0_0_10px] z-50">
        <div className="w-full min-h-[3.25rem] d-flex inline-flex">
          <div className="flex w-full h-[3.5rem] pr-5 ml-6 items-center">
            <Link to="/">
              <h1
                className="select-none text-white pointer-events-none text-2xl font-mono d-flex items-center justify-flex-start"
                title="brand"
                aria-label="Backups"
                data-section="nav"
                data-value="Backups"
                tabIndex="0"
              >
                Backups
              </h1>
            </Link>
          </div>
          <div className="flex w-full h-[3.5rem] mr-3.5 items-center justify-end">
            {/* <Link to="/sign-in">
              <Button
                label="Sign in"
                className="backupsBtn mr-2"
                id="sign-in"
              ></Button>
            </Link>

            <Link to="/sign-up">
              <Button
                label="Sign up"
                className="backupsBtn"
                id="sign-in"
              ></Button>
            </Link> */}
            {/*  <Button
            label={
              <span>
                <img src={collapseIcon} />
              </span>
            }
            className="navbar-toggler"
            style={{ border: "0" }}
          ></Button> */}

            <AccountOptions />
          </div>
        </div>
      </nav>
    </>
  );
}
