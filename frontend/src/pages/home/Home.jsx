import { useEffect } from "react";

//components
import { NavBar, UnauthorizedWarning } from "../../components";

//pages
import Configuration from "../account-config/Configuration";

//redux
import { useSelector, useDispatch } from "react-redux";
/* import { verifyToken } from "../../redux/features/authSlice"; */

export default function Home() {
  console.log("Home se está renderizando");
  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  return (
    <>
      <NavBar />
      <div className="mainContainer">
        <Configuration />
        {/* {isAuthenticated ? <MainLayout /> : <UnauthorizedWarning />} */}
      </div>
    </>
  );
}
