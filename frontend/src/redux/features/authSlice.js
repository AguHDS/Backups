import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getNewToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      console.log("iniciando peticion");
      const response = await fetch(`http://localhost:${import.meta.env.VITE_BACKENDPORT}/refreshTokens`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Couldn't get a new accessToken:", errorText);
        throw new Error(errorText || "Not authorized");
      }

      const data = await response.json();
      console.log("response with new accessToken: ", data);
      if (!data.accessToken || !data.userData) {
        console.error("Invalid format answer:", data);
        throw new Error("Invalid response format");
      }
      console.log("token renovado: ", data);
      return data;
    } catch (error) {
      console.error('Failed trying to get a new accessToken: ', error.message);
      return rejectWithValue(error.message);
    }
  }
);

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
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.userData = {};
      state.isAuthenticated = false;
    },
  },

  //for /refreshToken endpoint, to get a new accessToken when it's about to expire using refreshToken
  extraReducers: (builder) => {
    builder
      .addCase(getNewToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNewToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.userData = action.payload.userData;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getNewToken.rejected, (state, action) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.userData = {};
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
