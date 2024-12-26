import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../redux/features/authThunks";

//check if the expiration time is valid
const isAccessTokenValid = (accessToken) => {
  if (!accessToken) return false;

  try {
    const { exp } = jwtDecode(accessToken);
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const ProtectedRoute = () => {
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuthentication = async () => {
      if (!isAuthenticated || !isAccessTokenValid(accessToken)) {
        try {
          console.log("[Protected Route] trying to get new tokens");
          await dispatch(getNewToken()).unwrap();

          if (!isAuthenticated) {
            window.location.replace("/");
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          window.location.replace("/");
        }
        return null;
      }
    };
    
    verifyAuthentication();
  }, [isAuthenticated, accessToken, dispatch]);

  return <Outlet />;
};
