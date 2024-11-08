import styles from "./Navegation.module.css";
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
      <nav
        className={`${styles.navbar} navbar-expand-lg navbar fixed-top text-uppercase w-100`}
      >
        <div className={`${styles.containerFix} container`}>
          <Link to="/">
            <h1
              className={`${styles.navbarBrand} font-weight-bold`}
              title="brand"
              aria-label="Backups"
              data-section="nav"
              data-value="Backups"
              tabIndex="0"
            >
              Backups
            </h1>
          </Link>
          <Button
            label={
              <span className={`${styles.collapseIcone}`}>
                <img src={collapseIcon} />
              </span>
            }
            className="navbar-toggler"
            style={{ border: "0" }}
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          ></Button>
          <div
            className={`${styles.navBtnsFix} collapse navbar-collapse`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              <li className={`${styles.signContainer} nav-item`}>
                <Link to="/sign-in">
                  <Button
                    label="Sign in"
                    className="btn btn-primary oldgreenBtn"
                    id="sign-in"
                  ></Button>
                </Link>
              </li>
              <li className={`${styles.signContainer} nav-item`}>
                <Link to="/sign-up">
                  <Button
                    label="Sign up"
                    className="btn btn-primary oldgreenBtn"
                    id="sign-in"
                  ></Button>
                </Link>
              </li>
              {/* <li className="nav-item">
                <AccountOptions />
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
