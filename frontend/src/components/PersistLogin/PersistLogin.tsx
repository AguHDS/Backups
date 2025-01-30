import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoadingSpinner, Modal } from "..";
import { useModalContext } from "../Modal/context/ModalContext.js";
import { useSelector, useDispatch } from "react-redux";
import { getNewRefreshToken } from "../../redux/features/authThunks";
import { RootState, AppDispatch } from "../../redux/store";

//PersistLogin will try to get new tokens every time the app is reloaded
export const PersistLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setIsModalOpen } = useModalContext();

  //control modal(spinner) visibility based on loading state
  useEffect(() => {
    setIsModalOpen(isLoading);

    return () => {
      setIsModalOpen(false);
    };
  }, [isLoading, setIsModalOpen]);

  //verify the user has refresh token
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        if (!isAuthenticated && !accessToken) {
          await dispatch(getNewRefreshToken()).unwrap();
        }
      } catch (error) {
        console.error("Failed trying to verify refresh token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    verifyRefreshToken();
  }, [dispatch, isAuthenticated, accessToken]);



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
