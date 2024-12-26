import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../redux/features/authThunks";

//tries to get new tokens every time the app is reloaded
export const PersistLogin = () => {
  const dispatch = useDispatch();
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        if (!isAuthenticated && !accessToken) {
        console.log("[Persist login]: consumiendo getNewToken")
          await dispatch(getNewToken()).unwrap();
        }
      } catch (error) {
        console.error("Error verifying refresh token", error);
      } finally {
        setIsLoading(false);
        console.log("[persist login]: finally: isLoading is ", isLoading)
      }
    };

    verifyRefreshToken();
  }, []);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};
