import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Modal } from "../Modal";
import { ModalContext } from "../context/ModalProvider";

const modalRoot = document.createElement("div");
modalRoot.setAttribute("id", "modal-root");
document.body.appendChild(modalRoot);

describe("Modal", () => {
  const mockSetIsModalOpen = vi.fn();

  const renderWithContext = (isModalOpen = true, isSpinner = false) =>
    render(
      <ModalContext.Provider
        value={{ isModalOpen, setIsModalOpen: mockSetIsModalOpen }}
      >
        <Modal isSpinner={isSpinner}>
          <div>Modal content</div>
        </Modal>
      </ModalContext.Provider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
    modalRoot.innerHTML = "";
  });

  it("does not render if isModalOpen is false", () => {
    renderWithContext(false);

    const modalRoot = document.getElementById("modal-root")!;
    expect(modalRoot.innerHTML).toBe("");
  });

  it("calls setIsModalOpen(false) when clicking outside modal", () => {
    const { getByText } = renderWithContext();
    fireEvent.click(getByText("Modal content").parentElement!.parentElement!);
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it("calls setIsModalOpen(false) when Escape is pressed", () => {
    renderWithContext();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it("does NOT close on Escape if isSpinner is true", () => {
    renderWithContext(true, true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockSetIsModalOpen).not.toHaveBeenCalled();
  });
});
