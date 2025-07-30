import { loginMiddleware } from "@/interfaces/http/middlewares/loginMiddleware.js";
import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("express-validator", async () => {
  const actual = await vi.importActual<typeof import("express-validator")>("express-validator");
  return {
    ...actual,
    validationResult: vi.fn(),
    matchedData: vi.fn(),
  };
});

describe("loginMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should respond 400 if there are validation errors", () => {
    const mockValidationResult = vi.mocked(validationResult);
    mockValidationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Usuario requerido" }, { msg: "Contraseña requerida" }],
    } as any);

    loginMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuario requerido, Contraseña requerida" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should assign req.userAndPassword and call next() if there are no errors", () => {
    const mockValidationResult = vi.mocked(validationResult);
    const mockMatchedData = vi.mocked(matchedData);

    mockValidationResult.mockReturnValue({
      isEmpty: () => true,
    } as any);

    mockMatchedData.mockReturnValue({
      user: "testuser",
      password: "testpass",
    });

    loginMiddleware(req as Request, res as Response, next);

    expect(req.userAndPassword).toEqual({
      user: "testuser",
      password: "testpass",
    });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
