import { useState, useEffect } from "react";
import { LoadingSpinner, Modal, useModalContext } from "@/shared";
import { useSelector, useDispatch } from "react-redux";
import { getNewRefreshToken } from "@/app/redux/features/thunks/authThunk";
import type { RootState, AppDispatch } from "@/app/redux/store";
import { store } from "@/app/redux/store";

interface PersistLoginProps {
  children: React.ReactNode;
}

/**
 * Renew tokens and persist login across sessions
 */
export const PersistLogin = ({ children }: PersistLoginProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setIsModalOpen } = useModalContext();
  const { accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Spinner
  useEffect(() => {
    setIsModalOpen(isLoading);

    return () => {
      setIsModalOpen(false);
    };
  }, [isLoading, setIsModalOpen]);

  // Access token renewal
  useEffect(() => {
    const verifyRefreshToken = async () => {
      const hasSession = localStorage.getItem("hasSession");

      // If there's no session or already authenticated, skip token refresh
      if (hasSession !== "true" || (isAuthenticated && accessToken)) {
        setIsLoading(false);
        return;
      }

      try {
        await dispatch(getNewRefreshToken()).unwrap();
        const updatedState = store.getState().auth;

        if (!updatedState.isAuthenticated || !updatedState.userData?.name) {
          console.warn("Token refresh did not restore authentication");
          localStorage.removeItem("hasSession");
        }
      } catch (error) {
        console.error(`Token refresh failed: ${error}`);
        localStorage.removeItem("hasSession");
      } finally {
        setIsLoading(false);
      }
    };

    verifyRefreshToken();
  }, [dispatch]);

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
