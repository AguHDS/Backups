import { createSlice } from "@reduxjs/toolkit";
import { getNewRefreshToken, logout } from "./authThunks";
import { UserData } from "../../types";

interface AuthState {
  accessToken: string | null,
  userData: Partial<UserData>,
  status: "idle" | "loading" | "succeeded" | "failed";
  isAuthenticated: boolean,
  error?: string | number | null,
}

const initialState: AuthState = {
  accessToken: null,
  userData: {},
  status: "idle",
  isAuthenticated: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //probably will replace this one with thunk instead of using the custom hook auth.
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
    },
  },

  //extra reducers for authThunks
  extraReducers: (builder) => {
    builder
      .addCase(getNewRefreshToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNewRefreshToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.userData = action.payload.userData;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getNewRefreshToken.rejected, (state, action) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.userData = {};
        state.status = "idle";
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.accessToken = null;
        state.userData = {};
        state.status = "idle";
        state.isAuthenticated = false;
        state.error = action.payload || action.error.message;
      })
  },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
