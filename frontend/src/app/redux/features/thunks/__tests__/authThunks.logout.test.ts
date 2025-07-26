import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logout } from "../authThunk";
import type { UserSessionData } from "../../../../../shared/types";
import type { AuthState } from "../../slices/authSlice";
import type { DashboardState } from "../../slices/dashboardSlice";

type RootState = {
  auth: AuthState;
  dashboard: DashboardState;
};

const mockUser: UserSessionData = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  role: "user",
};

describe("logout thunk", () => {
  const mockDispatch = vi.fn();

  const mockGetState = vi.fn(
    (): RootState => ({
      auth: {
        accessToken: null,
        userData: mockUser,
        status: "idle",
        isAuthenticated: true,
        hasJustRefreshed: false,
        error: null,
      },
      dashboard: {
        used: 0,
        partner: null,
        totalFiles: 0,
        status: "idle",
        error: null,
      },
    })
  );

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fulfill with success message", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ message: "Session ended" }),
      })
    ) as unknown as typeof fetch;

    const thunk = logout();
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(result.type).toBe("auth/logout/fulfilled");
    expect(result.payload).toEqual({ message: "Session ended" });
  });

  it("should reject if fetch fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        text: async () => "Internal server error",
      })
    ) as unknown as typeof fetch;

    const thunk = logout();
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(result.type).toBe("auth/logout/rejected");
    expect(result.payload).toBe("Internal server error");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed trying to end session: ",
      "Internal server error"
    );
  });

  it("should reject if fetch throws network error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    global.fetch = vi.fn(() => {
      throw new Error("Network failure");
    }) as unknown as typeof fetch;

    const thunk = logout();
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(result.type).toBe("auth/logout/rejected");
    expect(result.payload).toBe("Network failure");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed trying to end session: ",
      "Network failure"
    );
  });
});
