import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

//context
import { useModalContext } from "./context/ModalContext";

export const Modal = ({ children }) => {
  const { isModalOpen, setIsModalOpen } = useModalContext();
  const modalRef = useRef(null);

  const modalRoot = document.getElementById("modal-root");

  useEffect(() => {
    if (!modalRoot) {
      console.error("Modal root not found");
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };

    if (isModalOpen) addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  if (!isModalOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div ref={modalRef}>
        {children}
      </div>
    </div>,
    modalRoot
  );
};
