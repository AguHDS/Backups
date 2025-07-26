import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getDashboardSummary } from "../dashboardThunk";
import type { RootState } from "../../../store";

const mockGetState = vi.fn(
  (): RootState => ({
    auth: {
      accessToken: null,
      userData: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "user",
      },
      status: "idle",
      isAuthenticated: true,
      hasJustRefreshed: false,
      error: null,
    },
    dashboard: {
      used: 0,
      partner: null,
      totalFiles: 0,
      status: "idle",
      error: null,
    },
  })
);

describe("getDashboardSummary thunk", () => { 
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fulfill with dashboard data", async () => {
    const sampleData = { used: 1234 };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => sampleData,
      })
    ) as unknown as typeof fetch;

    const thunk = getDashboardSummary();
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(result.type).toBe("dashboard/getSummary/fulfilled");
    expect(result.payload).toEqual(sampleData);
  });

  it("should reject with error message if fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as unknown as typeof fetch;

    const thunk = getDashboardSummary();
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(result.type).toBe("dashboard/getSummary/rejected");
    expect(result.payload).toBe("Error al obtener resumen del dashboard");
  });

  it("should reject with 'Unknown error' if unknown error is thrown", async () => {
    global.fetch = vi.fn(() => {
      throw "some string error";
    }) as unknown as typeof fetch;

    const thunk = getDashboardSummary();
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(result.type).toBe("dashboard/getSummary/rejected");
    expect(result.payload).toBe("Unknown error");
  });
});
