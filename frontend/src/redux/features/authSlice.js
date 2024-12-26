import { createSlice } from "@reduxjs/toolkit";
import { getNewToken, logout } from "./authThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    userData: {},
    status: "idle",
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    //probably will replace this one with thunk instead of using the custom hook auth.
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
    },
  },

  //extrareducers for async authentication
  extraReducers: (builder) => {
    builder
      .addCase(getNewToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNewToken.fulfilled, (state, action) => {
        console.log(state)
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.userData = action.payload.userData;
        console.log('la data es:', action.payload.userData)
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getNewToken.rejected, (state, action) => {
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
        state.error = action.payload || action.error.message;
      })
  },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
