import { createSlice } from "@reduxjs/toolkit";
import { getDashboardSummary } from "../thunks/dashboardThunk";

interface DashboardState {
  used: number;
  partner?: string | null;
  totalFiles?: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  used: 0,
  partner: null,
  totalFiles: 0,
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDashboardSummary.fulfilled, (state, action) => {
        state.used = action.payload.used;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getDashboardSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch dashboard summary";
      });
  },
});

export default dashboardSlice.reducer;
