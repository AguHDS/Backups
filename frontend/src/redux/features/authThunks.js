import { createAsyncThunk } from "@reduxjs/toolkit";

export const getNewToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:${import.meta.env.VITE_BACKENDPORT}/refreshToken`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Couldn't get a new accessToken:", errorText);

        if (response.status === 401) {
          return rejectWithValue("No refresh token in cookies");
        }

        if (response.status === 403) {
          return rejectWithValue("Invalid or expired refresh token");
        }


        throw new Error(errorText || "Not authorized");
      }

      const data = await response.json();
      console.log("accessToken renovado:", data);

      return data;
    } catch (error) {
      console.error("Failed trying to get a new accessToken: ", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const userId = state.auth.userData.id;
        console.log("user id from logout slice", userId)

      const response = await fetch(
        `http://localhost:${import.meta.env.VITE_BACKENDPORT}/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: userId }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Couldn't end session for user:", errorText);
        throw new Error(errorText);
      }

      console.log("Session ended");
      return { message: "Session ended" };
    } catch (error) {
      console.error("Failed trying to end session: ", error.message);
      return rejectWithValue(error.message);
    }
  }
);
