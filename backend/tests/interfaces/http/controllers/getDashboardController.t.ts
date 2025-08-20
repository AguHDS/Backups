/* import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getDashboardController } from "@/interfaces/http/controllers/getDashboardController.js";
import { Request, Response } from "express";
import { DashboardSummaryUseCase } from "@/application/useCases/DashboardSummaryUseCase.js";

describe("getDashboardController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: ReturnType<typeof vi.fn>;
  let jsonMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    req = {
      refreshTokenId: { id: "user123" },
    };

    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    res = {
      status: statusMock,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should answer with 200 and dashboard data", async () => {
    const fakeData = { used: 123456 };
    const executeMock = vi
      .spyOn(DashboardSummaryUseCase.prototype, "execute")
      .mockResolvedValue(fakeData);

    await getDashboardController(req as Request, res as Response);

    expect(executeMock).toHaveBeenCalledWith("user123");
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(fakeData);
  });

  it("should throw 500 if there's an error with the use case", async () => {
    const executeMock = vi
      .spyOn(DashboardSummaryUseCase.prototype, "execute")
      .mockRejectedValue(new Error("DB error"));

    await getDashboardController(req as Request, res as Response);

    expect(executeMock).toHaveBeenCalledWith("user123");
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Failed to get dashboard summary",
    });
  });
});
 */