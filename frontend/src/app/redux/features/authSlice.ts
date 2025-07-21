import { createSlice } from "@reduxjs/toolkit";
import { getNewRefreshToken, logout } from "./authThunks";
import { UserSessionData } from "../../../types";

interface AuthState {
  accessToken: string | null;
  userData: Partial<UserSessionData>;
  status: "idle" | "loading" | "succeeded" | "failed";
  isAuthenticated: boolean;
  hasJustRefreshed: boolean;
  error?: string | number | null;
}

const initialState: AuthState = {
  accessToken: null,
  userData: {},
  status: "idle",
  isAuthenticated: false,
  hasJustRefreshed: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // This will be probably replaced with a thunk instead of using the custom hook
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("hasSession", "true");
    },
    // Flag to control cooldown for refresh token rotation
    resetJustRefreshed: (state) => {
      state.hasJustRefreshed = false;
    },
  },

  // Extra reducers for thunks
  extraReducers: (builder) => {
    builder
      .addCase(getNewRefreshToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNewRefreshToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.userData = action.payload.userData;
        state.hasJustRefreshed = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getNewRefreshToken.rejected, (state, action) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.hasJustRefreshed = false;
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.userData = {};
        state.status = "idle";
        state.isAuthenticated = false;
        state.hasJustRefreshed = false;
        state.error = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("hasSession");
      })
      .addCase(logout.rejected, (state, action) => {
        state.accessToken = null;
        state.userData = {};
        state.status = "idle";
        state.isAuthenticated = false;
        state.hasJustRefreshed = false;
        state.error = action.payload || action.error.message;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("hasSession");
      });
  },
});

export const { login, resetJustRefreshed } = authSlice.actions;

export default authSlice.reducer;
