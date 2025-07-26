import authReducer, { login, resetJustRefreshed } from "../authSlice";
import { getNewRefreshToken, logout } from "../../thunks/authThunk";
import type { AuthState } from "../authSlice";
import type { UserDataWithToken, UserSessionData } from "../../../../../shared/types";

describe("authSlice", () => {
  const initialState: AuthState = {
    accessToken: null,
    userData: {},
    status: "idle",
    isAuthenticated: false,
    hasJustRefreshed: false,
    error: null,
  };

  const userData: UserSessionData = {
    id: 1,
    name: "test",
    email: "test@example.com",
    role: "admin",
  };

  const payload: UserDataWithToken = {
    accessToken: "mock-access-token",
    userData,
    refreshTokenRotated: true,
  };

  it("should handle initial state", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should handle login reducer", () => {
    const state = authReducer(initialState, login(payload));
    expect(state).toMatchObject({
      accessToken: payload.accessToken,
      userData: payload.userData,
      isAuthenticated: true,
    });
  });

  it("should handle resetJustRefreshed reducer", () => {
    const modifiedState = { ...initialState, hasJustRefreshed: true };
    const state = authReducer(modifiedState, resetJustRefreshed());
    expect(state.hasJustRefreshed).toBe(false);
  });

  it("should handle getNewRefreshToken.pending", () => {
    const action = { type: getNewRefreshToken.pending.type };
    const state = authReducer(initialState, action);
    expect(state.status).toBe("loading");
  });

  it("should handle getNewRefreshToken.fulfilled", () => {
    const action = { type: getNewRefreshToken.fulfilled.type, payload };
    const state = authReducer(initialState, action);
    expect(state).toMatchObject({
      accessToken: payload.accessToken,
      userData: payload.userData,
      isAuthenticated: true,
      hasJustRefreshed: true,
      status: "succeeded",
      error: null,
    });
  });

  it("should handle getNewRefreshToken.rejected", () => {
    const action = {
      type: getNewRefreshToken.rejected.type,
      payload: "error",
      error: { message: "error" },
    };
    const state = authReducer(initialState, action);
    expect(state).toMatchObject({
      accessToken: null,
      isAuthenticated: false,
      hasJustRefreshed: false,
      status: "failed",
      error: "error",
    });
  });

  it("should handle logout.fulfilled", () => {
    const loggedInState = {
      ...initialState,
      accessToken: "abc",
      userData,
      isAuthenticated: true,
    };
    const action = { type: logout.fulfilled.type };
    const state = authReducer(loggedInState, action);
    expect(state).toMatchObject(initialState);
  });

  it("should handle logout.rejected", () => {
    const loggedInState = {
      ...initialState,
      accessToken: "abc",
      userData,
      isAuthenticated: true,
    };
    const action = {
      type: logout.rejected.type,
      payload: "logout failed",
      error: { message: "logout failed" },
    };
    const state = authReducer(loggedInState, action);
    expect(state).toMatchObject({
      ...initialState,
      error: "logout failed",
    });
  });
});
