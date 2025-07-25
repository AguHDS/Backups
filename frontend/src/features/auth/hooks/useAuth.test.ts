import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import * as validationModule from "../helpers/validateSignAndLoginFields";

const mockFetchData = vi.fn();
const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock("@/shared/hooks/useFetch", () => ({
  useFetch: () => ({
    data: null,
    status: null,
    error: null,
    isLoading: false,
    fetchData: mockFetchData,
    setStatus: vi.fn(),
  }),
}));

vi.mock("../helpers/validateSignAndLogin");

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createFakeForm = () => {
    const form = document.createElement("form");

    const fields = {
      user: "testUser",
      password: "123",
      email: "testUser@example.com",
    };

    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.name = name;
      input.type = "text";
      input.value = value;
      form.appendChild(input);
    }

    return form;
  };

  it("fetchData is not called if there are validation errors", async () => {
    vi.spyOn(validationModule, "validateLoginFields").mockReturnValue([
      "All fields are required",
    ]);

    const { useAuth } = await import("./useAuth");
    const { result } = renderHook(() => useAuth());

    const fakeEvent = {
      preventDefault: vi.fn(),
      currentTarget: createFakeForm(),
    };

    act(() => {
      result.current.handleSubmit(fakeEvent as any);
    });

    expect(validationModule.validateLoginFields).toHaveBeenCalled();
    expect(mockFetchData).not.toHaveBeenCalled();
  });

  it("fetchData is called if validation is successful", async () => {
    vi.spyOn(validationModule, "validateLoginFields").mockReturnValue([]);

    const { useAuth } = await import("./useAuth");
    const { result } = renderHook(() => useAuth());

    const fakeEvent = {
      preventDefault: vi.fn(),
      currentTarget: createFakeForm(),
    };

    act(() => {
      result.current.handleSubmit(fakeEvent as any);
    });

    expect(mockFetchData).toHaveBeenCalled();
  });

  it("navigates to / when registration is successful", async () => {
    vi.resetModules();

    const mockFetchData = vi.fn();
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();

    vi.doMock("react-router-dom", () => ({
      useNavigate: () => mockNavigate,
    }));

    vi.doMock("react-redux", () => ({
      useDispatch: () => mockDispatch,
    }));

    vi.doMock("@/shared/hooks/useFetch", () => ({
      useFetch: () => ({
        data: { message: "Registration completed" },
        status: 200,
        error: null,
        isLoading: false,
        fetchData: mockFetchData,
        setStatus: vi.fn(),
      }),
    }));

    const { useAuth } = await import("./useAuth");
    renderHook(() => useAuth());

    await act(() => Promise.resolve());

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("dispatches login and redirects to /dashboard on successful login", async () => {
    vi.resetModules();

    const mockUserData = {
      accessToken: "mockAccessToken",
      refreshTokenRotated: true,
      userData: {
        name: "Test User",
        email: "test@example.com",
        role: "user" as const,
        id: 1,
      },
    };

    const mockFetchData = vi.fn();
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();

    const originalHref = window.location.href;
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...window.location,
        set href(val: string) {
          (this as any)._href = val;
        },
        get href() {
          return (this as any)._href;
        },
      },
    });

    vi.doMock("react-router-dom", () => ({
      useNavigate: () => mockNavigate,
    }));

    vi.doMock("react-redux", () => ({
      useDispatch: () => mockDispatch,
    }));

    vi.doMock("@/shared/hooks/useFetch", () => ({
      useFetch: () => ({
        data: mockUserData,
        status: 200,
        error: null,
        isLoading: false,
        fetchData: mockFetchData,
        setStatus: vi.fn(),
      }),
    }));

    vi.doMock("../../../app/redux/features/slices/authSlice", () => ({
      login: (data: any) => ({ type: "auth/login", payload: data }),
    }));

    const { useAuth } = await import("./useAuth");
    renderHook(() => useAuth());

    await act(() => Promise.resolve());

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/login",
      payload: mockUserData,
    });
    expect(window.location.href).toBe("/dashboard");

    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        href: originalHref,
      },
    });
  });
});
