import dashboardReducer from "../dashboardSlice";
import { getDashboardSummary } from "../../thunks/dashboardThunk";

interface DashboardState {
  used: number;
  partner?: string | null;
  totalFiles?: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

describe("dashboardSlice", () => {
  const initialState: DashboardState = {
    used: 0,
    partner: null,
    totalFiles: 0,
    status: "idle",
    error: null,
  };

  it("should handle initial state", () => {
    const state = dashboardReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  it("should handle getDashboardSummary.pending", () => {
    const action = { type: getDashboardSummary.pending.type };
    const state = dashboardReducer(initialState, action);
    expect(state.status).toBe("loading");
  });

  it("should handle getDashboardSummary.fulfilled", () => {
    const mockPayload = { used: 123456 };
    const action = {
      type: getDashboardSummary.fulfilled.type,
      payload: mockPayload,
    };
    const state = dashboardReducer(initialState, action);
    expect(state.status).toBe("succeeded");
    expect(state.used).toBe(mockPayload.used);
    expect(state.error).toBeNull();
  });

  it("should handle getDashboardSummary.rejected with payload", () => {
    const action = {
      type: getDashboardSummary.rejected.type,
      payload: "Request failed",
    };
    const state = dashboardReducer(initialState, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Request failed");
  });

  it("should handle getDashboardSummary.rejected without payload", () => {
    const action = {
      type: getDashboardSummary.rejected.type,
    };
    const state = dashboardReducer(initialState, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Failed to fetch dashboard summary");
  });
});
