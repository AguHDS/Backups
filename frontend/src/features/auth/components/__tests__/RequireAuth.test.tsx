import { describe, it, vi, expect, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RequireAuth } from "../RequireAuth";
import { Provider } from "react-redux";
import { store } from "../../../../app/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

vi.mock("react-redux", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    Outlet: () => <div>Outlet Rendered</div>,
    useNavigate: vi.fn(),
  };
});

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

const mockUseSelector = useSelector as unknown as Mock;
const mockUseDispatch = useDispatch as unknown as Mock;
const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

describe("<RequireAuth />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <RequireAuth />
      </Provider>
    );

  it("renders <Outlet /> if authenticated and token is valid", async () => {
    mockUseSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          accessToken: "valid.token",
          isAuthenticated: true,
          hasJustRefreshed: false,
        },
      })
    );

    (jwtDecode as Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 60,
    });

    renderComponent();

    expect(await screen.findByText("Outlet Rendered")).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("dispatches getNewRefreshToken if refresh token is expired", async () => {
    mockUseSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          accessToken: "expired.token",
          isAuthenticated: true,
          hasJustRefreshed: false,
        },
      })
    );

    (jwtDecode as Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) - 10,
    });

    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve({}),
    }));

    renderComponent();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navigates to /sign-in if refresh fails", async () => {
    mockUseSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          accessToken: "expired.token",
          isAuthenticated: true,
          hasJustRefreshed: false,
        },
      })
    );

    (jwtDecode as Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) - 10,
    });

    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.reject(new Error("refresh failed")),
    }));

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/sign-in");
    });
  });

  it("does not dispatch if hasJustRefreshed is true", async () => {
    mockUseSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          accessToken: "expired.token",
          isAuthenticated: true,
          hasJustRefreshed: true,
        },
      })
    );

    (jwtDecode as Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) - 10,
    });

    renderComponent();

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it("navigates if user is not authenticated", async () => {
    mockUseSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          accessToken: null,
          isAuthenticated: false,
          hasJustRefreshed: false,
        },
      })
    );

    renderComponent();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
