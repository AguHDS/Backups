import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

//components
import { LoadingSpinner, Modal } from "..";

//context
import { useModalContext } from "../Modal/context/ModalContext.js";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../redux/features/authThunks";

//this component will try to get new tokens every time the app is reloaded
export const PersistLogin = () => {
  const dispatch = useDispatch();
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsModalOpen } = useModalContext();

  //efffect to control modal(spinner) visibility based on loading state
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
          await dispatch(getNewToken()).unwrap();
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
        <Modal>
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
