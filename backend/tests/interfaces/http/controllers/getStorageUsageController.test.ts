import { describe, it, beforeEach, afterEach, expect, vi, type MockInstance } from "vitest";
import { getStorageUsageController } from "@/interfaces/http/controllers/getStorageUsageController.js";
import { GetStorageUsageUseCase } from "@/application/useCases/GetStorageUsageUseCase.js";
import { getMockReq, getMockRes } from "vitest-mock-express";

describe("getStorageUsageController", () => {
  let req: any;
  let res: any;
  let clearResMocks: () => void;
  let fakeExecute: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    req = getMockReq({ params: { username: "agustin" } });

    const mocks = getMockRes();
    res = mocks.res;
    clearResMocks = mocks.mockClear;
    clearResMocks();

    fakeExecute = vi
      .spyOn(GetStorageUsageUseCase.prototype, "execute")
      .mockResolvedValue({
        used: 123456,
        limit: 104857600,
        remaining: 104734144,
      }) as MockInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should respond with 200 and usage data if the user exists", async () => {
    await getStorageUsageController(req, res);

    expect(fakeExecute).toHaveBeenCalledWith("agustin");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        used: 123456,
        limit: 104857600,
        remaining: 104734144,
      })
    );
  });

  it("should respond with 404 if the user does not exist", async () => {
    fakeExecute.mockRejectedValueOnce(new Error("USER_NOT_FOUND"));

    await getStorageUsageController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should respond with 500 if an unexpected error occurs", async () => {
    fakeExecute.mockRejectedValueOnce(new Error("DB_FAILED"));

    await getStorageUsageController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to get storage usage",
    });
  });
});
