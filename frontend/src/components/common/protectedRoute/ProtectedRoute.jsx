//utils
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

//redux
import { getNewToken, logout } from "../../../redux/features/authThunks";

//check access token expiration time
const isAccessTokenValid = (accessToken) => {
  if (!accessToken) return false;

  try {
    const { exp } = jwtDecode(accessToken);
    const now = Math.floor(Date.now() / 1000);
    //exp > now = accessToken is valid
    return exp > now;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

  //check if user is authenticated and access token is valid before accessing protected childrens
  export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkToken = async () => {
      if (!isAuthenticated || isAccessTokenValid(accessToken)) return;

      try {
        await dispatch(getNewToken()).unwrap();
      } catch (error) {
        if (error === "Invalid or expired refresh token") {
          console.error("Failed trying to get a new accessToken:", error);
          dispatch(logout());
        }
      }
    };

    checkToken();
  }, [accessToken, isAuthenticated]); //probar si funciona asi

  if (!isAuthenticated && !isAccessTokenValid(accessToken)) {
    console.error("Protected route, you need to log in"); //usar portal modal aca
    return <Navigate to="/" replace />;
  }

  return children;
}
