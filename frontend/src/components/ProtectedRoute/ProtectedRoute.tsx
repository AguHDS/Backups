import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getNewRefreshToken } from "../../redux/features/authThunks";

//check if the expiration time is valid
const isAccessTokenValid = (accessToken: string | null): boolean => {
  if (!accessToken) return false;

  try {
    const { exp } = jwtDecode(accessToken);
    const now = Math.floor(Date.now() / 1000);

    return exp !== undefined ? exp > now : false;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

//component that checks if the user is authenticated to access private routes
export const ProtectedRoute = () => {
  const { accessToken, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuthentication = async () => {
      if (!isAuthenticated || !isAccessTokenValid(accessToken)) {
        try {
          console.log("[Protected Route] trying to get new tokens");
          const response = await dispatch(getNewRefreshToken());
          if (response.payload === 401) {
            console.error("[Protected Route] No refresh token in cookies. Redirecting to login");
            navigate("/sign-in");
          }
        } catch (error) {
          console.error("Error veryfing authentication (ProtectedRoute catch) :", error);
        }
      }
    };

    verifyAuthentication();
  }, [isAuthenticated, accessToken, dispatch, navigate]);

  return <>{isAuthenticated ? <Outlet /> : null}</>;
};
