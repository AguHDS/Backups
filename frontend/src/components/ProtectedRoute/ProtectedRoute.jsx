import { Outlet, useNavigate } from "react-router-dom";
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

//component that checks if the user is authenticated to access private routes
export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuthentication = async () => {
      if (!isAuthenticated || !isAccessTokenValid(accessToken)) {
        try {
          console.log("[Protected Route] trying to get new tokens");
          const response = await dispatch(getNewToken());
          if (response.payload === 401) {
            console.error(
              "[Protected Route] No refresh token in cookies. Redirecting to login."
            );
            navigate("/sign-in");
          }
        } catch (error) {
          console.error(
            "Error veryfing authentication (ProtectedRoute catch) :",
            error
          );
        }
      }
    };

    verifyAuthentication();
  }, [isAuthenticated, accessToken, dispatch, navigate]);

  return <>{isAuthenticated ? <Outlet /> : null}</>;
};
