import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFetch } from "../useFetch";

describe("useFetch", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetches data successfully", async () => {
    const mockData = { message: "ok" };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData("/api/test");
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.status).toBe(200);
    expect(result.current.isLoading).toBe(false);
  });

  it("handles fetch with error response", async () => {
    const mockError = { message: "Not found" };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => mockError,
    });

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData("/api/not-found");
    });

    expect(result.current.data).toEqual(mockError);
    expect(result.current.error).toBe("Not found");
    expect(result.current.status).toBe(404);
    expect(result.current.isLoading).toBe(false);
  });

  it("handles fetch exception", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData("/api/fail");
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.data).toBeNull();
    expect(result.current.status).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("setStatus manually updates status", () => {
    const { result } = renderHook(() => useFetch());

    act(() => {
      result.current.setStatus(204);
    });

    expect(result.current.status).toBe(204);
  });
});
