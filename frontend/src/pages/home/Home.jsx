import { useEffect } from "react";

//components
import { NavBar, UnauthorizedWarning } from "../../components";

//pages
import { Configuration, Profile } from "../";

//redux
import { useSelector, useDispatch } from "react-redux";
/* import { verifyToken } from "../../redux/features/authSlice"; va a ser necesario volver a verificar el token? pensar */

export default function Home() {
  console.log("Home se está renderizando");
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <NavBar />
      <div className="mainContainer">
        {isAuthenticated ? <Configuration /> : <UnauthorizedWarning />}
      </div>
    </>
  );
}
