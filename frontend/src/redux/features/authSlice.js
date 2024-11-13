import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const verifyToken = createAsyncThunk(
  "auth/verifyToken", // nombre de la accion, puede ser cualquiera
  async (_, { isRejectedWithValue }) => {
    // primer parametro opcional, segundo parametro para manejar el error
    try {
      const response = await fetch("http://localhost:3001/verify-token", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Not authorized");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(typeof error.message);
      console.error(error.message);
      return isRejectedWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    userData: {},
    shouldVerifyToken: true,
    status: "idle",
    error: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.shouldVerifyToken = false;
      state.userData = action.payload;
    },
    logout: (state) => {
      (state.isAuthenticated = false),
        (state.userData = {}),
        (state.shouldVerifyToken = true);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        console.log(typeof action.payload);
        state.isAuthenticated = true;
        state.userData = action.payload;
        state.shouldVerifyToken = false;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        console.log(typeof action.payload);
        state.isAuthenticated = false;
        state.status = "failed";
        state.shouldVerifyToken = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
