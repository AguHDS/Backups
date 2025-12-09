import { useRef, useEffect, ReactNode, MouseEvent, useCallback } from "react";
import { createPortal } from "react-dom";
import { useModalContext } from "./context/useModalContext";

interface Props {
  children: ReactNode;
  isSpinner?: boolean;
}

export const Modal = ({ children, isSpinner = false }: Props) => {
  const { isModalOpen, setIsModalOpen } = useModalContext();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const modalRoot = document.getElementById("modal-root");

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSpinner) {
        setIsModalOpen(false);
      }
    },
    [isSpinner, setIsModalOpen]
  );

  useEffect(() => {
    if (!modalRoot) {
      console.error("Modal root not found");
      return;
    }

    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen, handleEsc, modalRoot]);

  const closeModal = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  if (!isModalOpen || !modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div ref={modalRef}>{children}</div>
    </div>,
    modalRoot
  );
};
