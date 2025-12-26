import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "@/app/redux/store";
import type { UserDataWithToken } from "@/shared/types";

export const getNewRefreshToken = createAsyncThunk<
  UserDataWithToken,
  void,
  {
    rejectValue: string | number;
    state: RootState;
    dispatch: AppDispatch;
  }
>("auth/refreshToken", async (_, { rejectWithValue }) => {
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
});

export const logout = createAsyncThunk<
  { message: string },
  void,
  {
    state: RootState;
    rejectValue: string;
    dispatch: AppDispatch;
  }
>("auth/logout", async (_, { rejectWithValue, getState }) => {
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

    localStorage.removeItem("hasSession");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAuthenticated");

    return { message: "Session ended" };
  } catch (error) {
    localStorage.removeItem("hasSession");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAuthenticated");

    if (error instanceof Error) {
      console.error("Failed trying to end session: ", error.message);
      return rejectWithValue(error.message);
    } else {
      console.error("An unknown error occurred");
      return rejectWithValue("An unknown error occurred");
    }
  }
});
