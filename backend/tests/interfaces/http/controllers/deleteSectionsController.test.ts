import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mockRequest, mockResponse } from "jest-mock-req-res";
import { deleteSectionsController } from "@/interfaces/http/controllers/deleteSectionsController.js";
import { DeleteSectionsUseCase } from "@/application/useCases/DeleteSectionsUseCase.js";

describe("deleteSectionsController", () => {
  let req;
  let res;
  let fakeExecute;

  beforeEach(() => {
    req = mockRequest({
      params: { username: "agustin" },
      body: { sectionIds: [1, 2, 3] },
      baseUserData: { id: 42, name: "agustin", role: "user" },
    });

    res = mockResponse();

    fakeExecute = vi
      .spyOn(DeleteSectionsUseCase.prototype, "execute")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should respond 200 and executes the use case with valid data", async () => {
    await deleteSectionsController(req, res);

    expect(fakeExecute).toHaveBeenCalledWith([1, 2, 3], 42, "agustin");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Sections deleted successfully",
    });
  });

  it("should respond 400 if sectionIds is invalid", async () => {
    req.body.sectionIds = ["invalid", -1];

    await deleteSectionsController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid sectionIds array",
    });
    expect(fakeExecute).not.toHaveBeenCalled();
  });

  it("should respond 401 if the user ID is missing", async () => {
    delete req.baseUserData.id;

    await deleteSectionsController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: missing user ID",
    });
    expect(fakeExecute).not.toHaveBeenCalled();
  });

  it("should respond 400 if the use case throws NO_SECTIONS_ID", async () => {
    fakeExecute.mockRejectedValueOnce(new Error("NO_SECTIONS_ID"));

    await deleteSectionsController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Sections ID missing." });
  });

  it("should respond 500 if there is an unexpected error", async () => {
    fakeExecute.mockRejectedValueOnce(new Error("DB down"));

    await deleteSectionsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to delete sections",
    });
  });
});
