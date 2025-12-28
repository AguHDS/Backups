import { createSlice } from "@reduxjs/toolkit";
import type { UserSessionData } from "@/shared/types";

export interface AuthState {
  accessToken: string | null;
  userData: Partial<UserSessionData>;
  status: "idle" | "loading" | "succeeded" | "failed";
  isAuthenticated: boolean;
  error?: string | number | null;
}

const initialState: AuthState = {
  accessToken: null,
  userData: {},
  status: "idle",
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Used by login and refresh token mutations
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
      state.status = "succeeded";
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("hasSession", "true");
    },
    // Used by logout mutation
    clearAuth: (state) => {
      state.accessToken = null;
      state.userData = {};
      state.status = "idle";
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("hasSession");
    },
  },
});

export const { login, clearAuth } = authSlice.actions;

export default authSlice.reducer;
