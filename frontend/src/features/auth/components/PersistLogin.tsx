import { useState, useEffect } from "react";
import { LoadingSpinner, Modal, useModalContext } from "@/shared";
import { useSelector, useDispatch } from "react-redux";
import { getNewRefreshToken } from "@/app/redux/features/thunks/authThunk";
import { getDashboardSummary } from "@/app/redux/features/thunks/dashboardThunk";
import type { RootState, AppDispatch } from "@/app/redux/store";
import { store } from "@/app/redux/store";

interface PersistLoginProps {
  children: React.ReactNode;
}

export const PersistLogin = ({ children }: PersistLoginProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setIsModalOpen } = useModalContext();
  const { accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Spinner logic
  useEffect(() => {
    setIsModalOpen(isLoading);

    return () => {
      setIsModalOpen(false);
    };
  }, [isLoading, setIsModalOpen]);

  // Token renewal if possible and update redux state
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

          // Wait until redux state is updated
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
        children
      )}
    </>
  );
};