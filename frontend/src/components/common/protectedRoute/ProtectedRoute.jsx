//utils
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

//redux
import { getNewToken, logout } from "../../../redux/features/authSlice";

//check access token expiration time
const isAccessTokenValid = (accessToken) => {
  if (!accessToken) return false;

  try {
    const { exp } = jwtDecode(accessToken);
    console.log("expiration time is: ", exp);
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkToken = async () => {
      if (!isAuthenticated || isAccessTokenValid(accessToken)) return;

      try {
        await dispatch(getNewToken()).unwrap();
      } catch (error) {
        console.error("Failed trying to get a new accessToken:", error);
        dispatch(logout());
      }
    };

    checkToken();
  }, [accessToken, isAuthenticated, dispatch]);

  if (!isAuthenticated || !isAccessTokenValid(accessToken)) {
    console.error("Protected route, you need to log in");
    return <Navigate to="/" replace />;
  }

  return children;
}
