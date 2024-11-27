import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* 
//this will be used to check if the refresh/jwt token are valid/not expired when a protected route or the App.jsx is loaded 
//(note: if useEffect is used in the App.jsx to get another token thanks to refresh token due to global stated was lost because of 
//refreshing the page, make sure to do a validation at the start of the useEffect so it's not always triggered)

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  // primer parametro opcional, segundo parametro para manejar el error
  async (_, { rejectWithValue }) => {
    try {
      console.log("iniciando peticion");
      const response = await fetch("http://localhost:3001/verify-token", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Not authorized");
      }
      const data = await response.json();
      console.log("token verificado: ", data);
      return data;
    } catch (error) {
      console.error(error.message);
      return rejectWithValue(error.message);
    }
  }
); */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: {},
    role: null,
    status: "idle",
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.userData = {};
      state.role = null;
      state.isAuthenticated = false;
    },
  },

  /* 
    extraReducers: (builder) => { 
    builder
      .addCase(verifyToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userData = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        console.log(
          "Estado actual del slice de auth en rejected:",
          JSON.parse(JSON.stringify(state))
        );

        state.isAuthenticated = false;
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  }, */
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
