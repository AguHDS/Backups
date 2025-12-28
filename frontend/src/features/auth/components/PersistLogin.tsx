import { useState, useEffect } from "react";
import { LoadingSpinner, Modal, useModalContext } from "@/shared";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/redux/store";
import { store } from "@/app/redux/store";
import { login as loginAction } from "@/app/redux/features/slices/authSlice";
import { useRefreshToken } from "../hooks/useAuthMutations";

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

  const refreshTokenMutation = useRefreshToken();

  // Spinner
  useEffect(() => {
    setIsModalOpen(isLoading);

    return () => {
      setIsModalOpen(false);
    };
  }, [isLoading, setIsModalOpen]);

  // Access token renewal - only run once on mount
  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      const hasSession = localStorage.getItem("hasSession");

      // If there's no session or already authenticated, skip token refresh
      if (hasSession !== "true" || (isAuthenticated && accessToken)) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const result = await refreshTokenMutation.mutateAsync();
        
        if (!isMounted) return;

        // Dispatch to Redux to update auth state
        dispatch(
          loginAction({
            accessToken: result.accessToken,
            userData: result.userData,
            refreshTokenRotated: true,
          })
        );

        const updatedState = store.getState().auth;

        if (!updatedState.isAuthenticated || !updatedState.userData?.name) {
          console.warn("Token refresh did not restore authentication");
          localStorage.removeItem("hasSession");
        }
      } catch (error) {
        console.error(`Token refresh failed: ${error}`);
        localStorage.removeItem("hasSession");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    verifyRefreshToken();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
