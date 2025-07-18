import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserDataWithToken } from "../../../types";

export const getNewRefreshToken = createAsyncThunk<UserDataWithToken, void, { rejectValue: string | number }>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/refreshToken`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Couldn't get a new accessToken:", errorText);

        //no refresh token in cookies
        if (response.status === 401) {
          return rejectWithValue(401);
        }

        //invalid or expired refresh token
        if (response.status === 403) {
          return rejectWithValue("Invalid or expired refresh token");
        }

        throw new Error(errorText || "Not authorized");
      }

      const data: UserDataWithToken = await response.json();
      console.log("[dev log]: accessToken renovado:", data);

      return data;
    } catch (error) {
      if(error instanceof Error) {
        console.error("Token authentication failed: ", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error("An unknown error occurred");
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const logout = createAsyncThunk<{ message: string }, void, { state: RootState; rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const userId = state.auth.userData.id;

        const response = await fetch(
        `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/logout`,
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
      if(error instanceof Error) {
        console.error("Failed trying to end session: ", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error("An unknown error occurred");
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);
