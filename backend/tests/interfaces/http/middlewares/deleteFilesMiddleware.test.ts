import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteFilesMiddleware } from "@/interfaces/http/middlewares/deleteFilesMiddleware.js";
import { getMockReq, getMockRes } from "vitest-mock-express";

describe("deleteFilesMiddleware", () => {
  let req: any;
  let res: any;
  let next: any;
  let clearResMocks: () => void;

  beforeEach(() => {
    req = getMockReq();
    const mocks = getMockRes();
    res = mocks.res;
    next = mocks.next;
    clearResMocks = mocks.mockClear;
    clearResMocks();
  });

  it("should call next() if payload is valid", () => {
    req.body = [
      {
        sectionId: 1,
        publicIds: ["id1", "id2"],
      },
    ];

    deleteFilesMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should throw 400 if payload is not an array", () => {
    req.body = { sectionId: 1, publicIds: ["id1"] };

    deleteFilesMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Payload must be a non-empty array",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw 400 if payload is an empty array", () => {
    req.body = [];

    deleteFilesMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Payload must be a non-empty array",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw 400 if sectionId is not a number", () => {
    req.body = [
      {
        sectionId: "abc",
        publicIds: ["id1"],
      },
    ];

    deleteFilesMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Each item must have a numeric sectionId and a non-empty array of publicIds (strings)",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw 400 if publicIds is not an array", () => {
    req.body = [
      {
        sectionId: 1,
        publicIds: "id1",
      },
    ];

    deleteFilesMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Each item must have a numeric sectionId and a non-empty array of publicIds (strings)",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw 400 if publicIds is empty", () => {
    req.body = [
      {
        sectionId: 1,
        publicIds: [],
      },
    ];

    deleteFilesMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Each item must have a numeric sectionId and a non-empty array of publicIds (strings)",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw 400 if any publicId is not string or empty", () => {
    req.body = [
      {
        sectionId: 1,
        publicIds: ["id1", " "],
      },
    ];

    deleteFilesMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Each item must have a numeric sectionId and a non-empty array of publicIds (strings)",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
