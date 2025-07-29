import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { mockRequest, mockResponse } from "jest-mock-req-res";
import { Request, Response } from "express";
import { getStorageUsageController } from "@/interfaces/http/controllers/getStorageUsageController.js";
import { GetStorageUsageUseCase } from "@/application/useCases/GetStorageUsageUseCase.js";

describe("getStorageUsageController", () => {
  let req: Request;
  let res: Response;
  let fakeExecute: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    req = mockRequest({
      params: { username: "agustin" },
    }) as unknown as Request;

    res = mockResponse() as unknown as Response;

    fakeExecute = vi
      .spyOn(GetStorageUsageUseCase.prototype, "execute")
      .mockResolvedValue({ used: 123456 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should respond with 200 and usage data if the user exists", async () => {
    await getStorageUsageController(req, res);

    expect(fakeExecute).toHaveBeenCalledWith("agustin");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ used: 123456 });
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
