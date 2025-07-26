import { describe, it, vi, type Mock, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { NavBar } from "../navbar/NavBar";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/redux/store";
import { useDispatch } from "react-redux";

vi.mock("react-redux", async (mod) => ({
  ...(await mod),
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

const mockUseDispatch = useDispatch as unknown as Mock;
const mockUseSelector = useSelector as unknown as Mock;

describe("NavBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDispatch.mockReturnValue(vi.fn());
  });

  it("should show AccountOptions if user is authenticated", () => {
    mockUseSelector.mockImplementation(
      (selectorFn: (state: RootState) => unknown) =>
        selectorFn({
          auth: {
            isAuthenticated: true,
            userData: { name: "TestUser" },
          },
          dashboard: {},
        } as RootState)
    );

    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByText("TestUser")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign in" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign up" })
    ).not.toBeInTheDocument();
  });

  it("should show sign up and sign in buttons if user isn't authenticted", () => {
    mockUseSelector.mockImplementation(
      (selectorFn: (state: RootState) => unknown) =>
        selectorFn({
          auth: {
            isAuthenticated: false,
            userData: {},
          },
          dashboard: {},
        } as RootState)
    );

    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.queryByText("TestUser")).not.toBeInTheDocument();
  });
});
