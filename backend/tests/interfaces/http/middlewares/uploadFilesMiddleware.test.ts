import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadFilesMiddleware } from "@/interfaces/http/middlewares/uploadFilesMiddleware.js";
import type { Request, Response, NextFunction } from "express";

vi.mock("../../../infraestructure/config/multerConfig.js", () => ({
  upload: {
    array: vi.fn(() => mockMulterHandler),
  },
}));

const mockMulterHandler = vi.fn();

describe("uploadFilesMiddleware", () => {
  let req: Partial<Request> & { files?: any };
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should return 400 if total file size exceeds 3MB", () => {
    req.files = [{ size: 2 * 1024 * 1024 }, { size: 1.5 * 1024 * 1024 }];

    mockMulterHandler.mockImplementationOnce((req, res, cb) => cb(null));

    uploadFilesMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("exceeds the 3MB limit"),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when no errors and total file size is within limit", () => {
    req.files = [{ size: 1 * 1024 * 1024 }, { size: 1.5 * 1024 * 1024 }];

    mockMulterHandler.mockImplementationOnce((req, res, cb) => cb(null));

    uploadFilesMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
