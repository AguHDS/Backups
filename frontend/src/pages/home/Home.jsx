import { useEffect } from "react";

//common components
import { NavBar, UnauthorizedWarning } from "../../components/common/";

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
      <div className="contentWrapper">

        <Profile />
        {/* <Configuration />
        {isAuthenticated ? <Profile /> : <UnauthorizedWarning />} */}
      </div>
    </>
  );
}
