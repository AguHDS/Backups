import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountOptions from "../navbar/AccountOptions";
import { BrowserRouter } from "react-router-dom";

const mockDispatch = vi.fn(() =>
  Promise.resolve({ type: "auth/logout/fulfilled" })
);
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  };
});

describe("AccountOptions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should show username", () => {
    render(
      <BrowserRouter>
        <AccountOptions username="testuser" />
      </BrowserRouter>
    );
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("should open menu when click and display options", async () => {
    render(
      <BrowserRouter>
        <AccountOptions username="testuser" />
      </BrowserRouter>
    );

    const trigger = screen.getByText("testuser");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Configuration")).toBeInTheDocument();
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });
  });

  it("should redirect to home when logout is successful", async () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <BrowserRouter>
        <AccountOptions username="testuser" />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("testuser"));
    await waitFor(() => screen.getByText("Logout"));

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
      expect(reloadMock).toHaveBeenCalled();
    });
  });
});
