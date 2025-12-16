import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getNewRefreshToken } from "../authThunk";
import { resetJustRefreshed } from "../../slices/authSlice";
import type {
  UserDataWithToken,
  UserSessionData,
} from "../../../../../shared/types";
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

const sampleUserData: UserDataWithToken = {
  accessToken: "test-access-token",
  userData: mockUser,
  refreshTokenRotated: true,
};

describe("getNewRefreshToken thunk", () => {
  const mockDispatch = vi.fn();

  const mockGetState = vi.fn<() => RootState>(() => ({
    auth: {
      accessToken: null,
      userData: mockUser,
      status: "idle",
      isAuthenticated: false,
      hasJustRefreshed: false,
      error: null,
    },
    dashboard: {
      used: 0,
      totalFiles: 0,
      status: "idle",
      error: null,
    },
  }));

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fulfill with user data", async () => {
    vi.useFakeTimers();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => sampleUserData,
      })
    ) as unknown as typeof fetch;

    const result = await getNewRefreshToken()(
      mockDispatch,
      mockGetState,
      undefined
    );

    expect(result.type).toBe("auth/refreshToken/fulfilled");
    expect(result.payload).toEqual(sampleUserData);

    vi.runAllTimers();

    expect(mockDispatch).toHaveBeenCalledWith(resetJustRefreshed());
  });

  it("should reject with 401 if unauthorized", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        text: () => Promise.resolve("Unauthorized"),
      })
    ) as unknown as typeof fetch;

    const thunk = getNewRefreshToken();
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(result.type).toBe("auth/refreshToken/rejected");
    expect(result.payload).toBe(401);
  });

  it("should reject with message if fetch throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = vi.fn(() => {
      throw new Error("Network error");
    }) as unknown as typeof fetch;

    const thunk = getNewRefreshToken();
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(result.type).toBe("auth/refreshToken/rejected");
    expect(result.payload).toBe("Network error");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Token authentication failed: ",
      "Network error"
    );
  });
});
