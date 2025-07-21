import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { RootState, AppDispatch } from "../../../app/redux/store";
import { getNewRefreshToken } from "../../../app/redux/features/authThunks";

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

export const RequireAuth = () => {
  const { accessToken, isAuthenticated, hasJustRefreshed } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuthentication = async () => {
      const tokenExpired = !isAccessTokenValid(accessToken);

      if (!isAuthenticated || tokenExpired) {
        if (hasJustRefreshed) return;

        try {
          await dispatch(getNewRefreshToken()).unwrap();
        } catch (err) {
          console.error("Error during token rotation:", err);
          navigate("/sign-in");
        }
      }
    };

    verifyAuthentication();
  }, [isAuthenticated, accessToken, dispatch, navigate]);

  return <>{isAuthenticated ? <Outlet /> : null}</>;
};
