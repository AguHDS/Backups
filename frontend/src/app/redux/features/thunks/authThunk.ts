import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { UserDataWithToken } from "../../../../shared/types";
import { resetJustRefreshed } from "../slices/authSlice";

export const getNewRefreshToken = createAsyncThunk<
  UserDataWithToken,
  void,
  { rejectValue: string | number; state: RootState; dispatch: any }
>(
  "auth/refreshToken",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(
        `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/refreshToken`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Unauthorized");

        if (response.status === 401) {
          return rejectWithValue(401);
        }

        if (response.status === 403) {
          return rejectWithValue("Invalid or expired refresh token");
        }

        throw new Error(errorText || "Not authorized");
      }

      const data: UserDataWithToken = await response.json();

      setTimeout(() => {
        dispatch(resetJustRefreshed());
      }, 20_000);

      return data;
    } catch (error) {
      if (error instanceof Error) {
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
        throw new Error(errorText);
      }

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
