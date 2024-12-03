import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getNewToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      console.log("iniciando peticion");
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/refreshToken`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("algo salió mal:", errorText);
        throw new Error(errorText || "Not authorized");
      }

      const data = await response.json();
      if (!data.accessToken || !data.userData) {
        console.error("Formato de respuesta inválido:", data);
        throw new Error("Invalid response format");
      }
      console.log("token verificado: ", data);
      return data;
    } catch (error) {
      console.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: {},
    status: "idle",
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.accessToken; 
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.userData = {};
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNewToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNewToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.userData = action.payload;
        console.log("el resultado es: ", action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getNewToken.rejected, (state, action) => {
        console.error(
          "getNewToken failed_1:",
          action.payload || action.error.message
        );
        state.token = null;
        state.isAuthenticated = false;
        state.userData = {};
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
