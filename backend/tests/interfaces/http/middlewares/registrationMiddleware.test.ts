import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { registrationMiddleware } from "@/interfaces/http/middlewares/registrationMiddleware.js";
import { validationResult, matchedData } from "express-validator";
import { Request, Response, NextFunction } from "express";

vi.mock("express-validator", async () => {
  const actual = await vi.importActual<typeof import("express-validator")>(
    "express-validator"
  );
  return {
    ...actual,
    validationResult: vi.fn(),
    matchedData: vi.fn(),
  };
});

interface MockRequest extends Partial<Request> {
  userSession?: {
    user: string;
    email: string;
    password: string;
  };
}

describe("registrationMiddleware", () => {
  let req: MockRequest;
  let res: Partial<Response>;
  let next: NextFunction;

  const validationResultMock = validationResult as unknown as Mock;
  const matchedDataMock = matchedData as unknown as Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();

    vi.clearAllMocks();
  });

  it("should return 400 if validation errors are present", () => {
    validationResultMock.mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid email" }, { msg: "Password too short" }],
    });

    registrationMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
      })
    );

    expect(next).not.toHaveBeenCalled();
  });

  it("should assign userSession and call next when validation passes", () => {
    validationResultMock.mockReturnValueOnce({
      isEmpty: () => true,
    });

    matchedDataMock.mockReturnValueOnce({
      user: "userTest",
      email: "userTest@example.com",
      password: "password123",
    });

    registrationMiddleware(req as Request, res as Response, next);

    expect(req.userSession).toEqual({
      user: "userTest",
      email: "userTest@example.com",
      password: "password123",
    });

    expect(next).toHaveBeenCalled();
  });
});
