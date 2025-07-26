import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequireRole } from "../../components/RequiredRole";
import { Provider } from "react-redux";
import { store } from "../../../../app/redux/store";
import { useSelector } from "react-redux";

vi.mock("react-redux", async (importOriginal) => {
  const actual = (await importOriginal()) as object; // ✅ FIX
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as object; // ✅ FIX
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div>Redirected to {to}</div>,
    Outlet: () => <div>Outlet Rendered</div>,
  };
});

const mockUseSelector = useSelector as unknown as Mock;

describe("<RequireRole />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRole = (
    authState: any,
    allowedRoles: ("user" | "admin")[]
  ) => {
    mockUseSelector.mockImplementation((selectorFn) =>
      selectorFn({ auth: authState })
    );

    return render(
      <Provider store={store}>
        <RequireRole allowedRoles={allowedRoles} />
      </Provider>
    );
  };

  it("renders Outlet if user is authenticated and role is allowed", () => {
    renderWithRole(
      {
        isAuthenticated: true,
        userData: { role: "admin" },
      },
      ["admin", "user"]
    );

    expect(screen.getByText("Outlet Rendered")).toBeInTheDocument();
  });

  it("redirects if user is authenticated but role is not allowed", () => {
    renderWithRole(
      {
        isAuthenticated: true,
        userData: { role: "user" },
      },
      ["admin"]
    );

    expect(screen.getByText("Redirected to /unauthorized")).toBeInTheDocument();
  });

  it("redirects if user is not authenticated", () => {
    renderWithRole(
      {
        isAuthenticated: false,
        userData: { role: "user" },
      },
      ["admin", "user"]
    );

    expect(screen.getByText("Redirected to /unauthorized")).toBeInTheDocument();
  });

  it("redirects if userData.role is undefined", () => {
    renderWithRole(
      {
        isAuthenticated: true,
        userData: { role: undefined },
      },
      ["admin", "user"]
    );

    expect(screen.getByText("Redirected to /unauthorized")).toBeInTheDocument();
  });
});
