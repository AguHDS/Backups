import { useEffect } from "react";

//components
import { NavBar, UnauthorizedWarning } from "../../components";

//pages
import MainLayout from "../main-layout/MainLayout";

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
        {isAuthenticated ? <MainLayout /> : <UnauthorizedWarning />}
      </div>
    </>
  );
}
