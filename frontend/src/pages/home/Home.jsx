import { useEffect } from "react";

//components
import { NavBar, UnauthorizedWarning } from "../../components";

//pages
import MainModal from "../main-modal/MainModal";

//redux
import { useSelector, useDispatch } from "react-redux";
import { verifyToken } from "../../redux/features/authSlice";

export default function Home() {
  console.log("Home se está renderizando");
  const { isAuthenticated, shouldVerfifyToken } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(verifyToken());
  }, [dispatch ]);

  return (
    <>
      <NavBar />
      {isAuthenticated ? <MainModal /> : <UnauthorizedWarning />}
    </>
  );
}
