import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const getDashboardSummary = createAsyncThunk<
  { used: number; },
  void,
  { rejectValue: string; state: RootState }
>("dashboard/getSummary", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/dashboard-summary`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error al obtener resumen del dashboard");

    const data = await res.json();
    return data;
  } catch (err) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue("Unknown error");
  }
});
