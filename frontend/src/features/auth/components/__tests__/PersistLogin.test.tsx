import {
  describe,
  it,
  vi,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { PersistLogin } from "../PersistLogin";
import { Provider } from "react-redux";
import { store } from "../../../../app/redux/store";
import { ModalProvider } from "../../../../shared/ui/Modal/ModalContext";
import { useDispatch, useSelector } from "react-redux";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    Outlet: () => <div>Outlet Rendered</div>,
  };
});

const setIsModalOpenMock = vi.fn();

vi.mock("react-redux", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

vi.mock("../../../../shared", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useModalContext: () => ({
      setIsModalOpen: setIsModalOpenMock,
    }),
  };
});

const mockUseDispatch = useDispatch as unknown as Mock;
const mockUseSelector = useSelector as unknown as Mock;

describe("<PersistLogin />", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
    setIsModalOpenMock.mockClear();

    mockDispatch.mockImplementation((fn: unknown) => {
      if (
        typeof fn === "function" &&
        fn.toString().includes("getNewRefreshToken")
      ) {
        return {
          unwrap: () => Promise.resolve({}),
        };
      }
      if (
        typeof fn === "function" &&
        fn.toString().includes("getDashboardSummary")
      ) {
        return {
          unwrap: () => Promise.resolve({}),
        };
      }
      return { unwrap: () => Promise.resolve({}) };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <ModalProvider>
          <PersistLogin />
        </ModalProvider>
      </Provider>
    );

  it("should dispatch thunks and render <Outlet /> after loading", async () => {
    localStorage.setItem("hasSession", "true");

    mockUseSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          accessToken: null,
          isAuthenticated: false,
          userData: { name: "test user" },
        },
        dashboard: {},
      })
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Outlet Rendered")).toBeInTheDocument();
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(setIsModalOpenMock).toHaveBeenCalledWith(true);
    expect(setIsModalOpenMock).toHaveBeenCalledWith(false);
  });

  it("should not dispatch anything if hasSession is false", async () => {
    localStorage.setItem("hasSession", "false");

    mockUseSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          accessToken: null,
          isAuthenticated: false,
          userData: null,
        },
      })
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Outlet Rendered")).toBeInTheDocument();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("should not dispatch anything if user is already authenticated", async () => {
    localStorage.setItem("hasSession", "true");

    mockUseSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          accessToken: null,
          isAuthenticated: true,
          userData: { name: "Already Logged" },
        },
      })
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Outlet Rendered")).toBeInTheDocument();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
