import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { deleteFilesController } from "@/interfaces/http/controllers/deleteFilesController.js";
import { mockRequest, mockResponse } from "jest-mock-req-res";
import { Request, Response } from "express";
import { DeleteFilesFromSectionsUseCase } from "@/application/useCases/DeleteFilesFromSectionsUseCase.js";
import { BaseUserData } from "@/shared/dtos/userDto.js";

describe("deleteFilesController", () => {
  let req: Request;
  let res: Response;
  let fakeExecute: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();

    req.body = [
      {
        sectionId: 1,
        publicIds: ["file1", "file2"],
      },
    ];
    req.baseUserData = {
      id: 123,
      name: "agustin",
      role: "user",
    } satisfies BaseUserData;

    fakeExecute = vi
      .spyOn(DeleteFilesFromSectionsUseCase.prototype, "execute")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should respond 200 and executes the use case with correct data", async () => {
    await deleteFilesController(req, res);

    expect(fakeExecute).toHaveBeenCalledWith(123, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("should respond 500 if the use case throws an error", async () => {
    fakeExecute.mockRejectedValueOnce(new Error("DB crash"));

    await deleteFilesController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to delete files",
    });
  });
});
