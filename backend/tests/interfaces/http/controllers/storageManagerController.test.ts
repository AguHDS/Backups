import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { storageManagerController } from "@/interfaces/http/controllers/storageManagerController.js";
import { StorageManagerUseCase } from "@/application/useCases/StorageManagerUseCase.js";
import { Request, Response } from "express";

interface MockRequest extends Partial<Request> {
  refreshTokenId: { id: string };
}

describe("storageManagerController", () => {
  let req: MockRequest;
  let res: Partial<Response>;
  let executeMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    req = {
      refreshTokenId: { id: "user123" },
    };

    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    executeMock = vi
      .spyOn(StorageManagerUseCase.prototype, "execute")
      .mockResolvedValue({ totalBytesUsed: 1024 }) as MockInstance;

    vi.clearAllMocks();
  });

  it("should return storage usage on success", async () => {
    await storageManagerController(req as Request, res as Response);

    expect(executeMock).toHaveBeenCalledWith("user123");
    expect(res.json).toHaveBeenCalledWith({ totalBytesUsed: 1024 });
  });

  it("should return 500 if execute throws", async () => {
    executeMock.mockRejectedValueOnce(new Error("DB_ERROR"));

    await storageManagerController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to get storage usage",
    });
  });
});
