import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoadingSpinner, Modal, useModalContext } from "../../../shared";
import { useSelector, useDispatch } from "react-redux";
import { getNewRefreshToken } from "../../../app/redux/features/thunks/authThunk";
import { getDashboardSummary } from "../../../app/redux/features/thunks/dashboardThunk";
import { RootState, AppDispatch } from "../../../app/redux/store";
import { store } from "../../../app/redux/store";

// PersistLogin will try to get new tokens every time the app is reloaded
export const PersistLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setIsModalOpen } = useModalContext();
  const { accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Control modal(spinner) visibility based on loading state
  useEffect(() => {
    setIsModalOpen(isLoading);

    return () => {
      setIsModalOpen(false);
    };
  }, [isLoading, setIsModalOpen]);

  // Verify the user has refresh token
  useEffect(() => {
    const verifyRefreshToken = async () => {
      const hasSession = localStorage.getItem("hasSession");

      try {
        if (
          isAuthenticated === false &&
          !accessToken &&
          hasSession === "true"
        ) {
          await dispatch(getNewRefreshToken()).unwrap();

          // wait until redux state is updated
          const updatedUserData = store.getState().auth.userData;

          if (updatedUserData?.name) {
            await dispatch(getDashboardSummary()).unwrap();
          } else {
            console.warn("Username not available after refresh token.");
          }
        }
      } catch (error) {
        console.error(`Error: ${error} (Unauthorized)`);
      } finally {
        setIsLoading(false);
      }
    };

    verifyRefreshToken();
  }, [dispatch, accessToken, isAuthenticated]);

  return (
    <>
      {isLoading ? (
        <Modal isSpinner={true}>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        </Modal>
      ) : (
        <Outlet />
      )}
    </>
  );
};
