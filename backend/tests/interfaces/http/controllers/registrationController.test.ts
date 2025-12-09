import { describe, it, expect, vi, beforeEach, type MockInstance  } from "vitest";
import { registerController } from "@/interfaces/http/controllers/registrationController.js";
import { RegisterUserUseCase } from "@/application/useCases/RegisterUserUseCase.js";
import { Request, Response } from "express";

interface MockRequest extends Partial<Request> {
  userSession: {
    user: string;
    email: string;
    password: string;
  };
}

describe("registerController", () => {
  let req: MockRequest;
  let res: Partial<Response>;
  let executeMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    req = {
      userSession: {
        user: "testUser",
        email: "test@example.com",
        password: "test123",
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    executeMock = vi
      .spyOn(RegisterUserUseCase.prototype, "execute")
      .mockResolvedValue(undefined) as MockInstance;

    vi.clearAllMocks();
  });

  it("should respond 201 on successful registration", async () => {
    await registerController(req as Request, res as Response);

    expect(executeMock).toHaveBeenCalledWith(
      "testUser",
      "test@example.com",
      "test123"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Registration completed",
    });
  });

  it("should respond 409 if username is taken", async () => {
    executeMock.mockRejectedValueOnce(new Error("USERNAME_TAKEN"));

    await registerController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username already taken",
    });
  });

  it("should respond 409 if email is taken", async () => {
    executeMock.mockRejectedValueOnce(new Error("EMAIL_TAKEN"));

    await registerController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "Email already taken" });
  });

  it("should respond 409 if username and email are taken", async () => {
    executeMock.mockRejectedValueOnce(new Error("USERNAME_AND_EMAIL_TAKEN"));

    await registerController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username and email are already taken",
    });
  });

  it("should respond 500 on unknown error", async () => {
    executeMock.mockRejectedValueOnce(new Error("SOMETHING_UNEXPECTED"));

    await registerController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error trying to sign up",
    });
  });
});
