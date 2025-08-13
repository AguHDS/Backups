import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { deleteFilesController } from "@/interfaces/http/controllers/deleteFilesController.js";
import { getMockReq, getMockRes } from "vitest-mock-express";
import { DeleteFilesFromSectionsUseCase } from "@/application/useCases/DeleteFilesFromSectionsUseCase.js";

describe("deleteFilesController", () => {
  let req: any;
  let res: any;
  let fakeExecute: ReturnType<typeof vi.spyOn>;
  let clearResMocks: () => void;

  beforeEach(() => {
    req = getMockReq();
    const mocks = getMockRes();
    res = mocks.res;
    clearResMocks = mocks.mockClear;
    clearResMocks();

    req.body = [
      {
        sectionId: 1,
        publicIds: ["file1", "file2"],
      },
    ];
    (req as any).baseUserData = {
      id: 123,
      name: "agustin",
      role: "user",
    };

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
