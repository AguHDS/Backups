import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateBioAndSectionsController } from "@/interfaces/http/controllers/updateBioAndSectionsController.js";
import { UpdateUserProfileUseCase } from "@/application/useCases/UpdateUserProfileUseCase.js";
import { matchedData } from "express-validator";
import { Request, Response } from "express";
import { BaseUserData } from "@/shared/dtos/userDto.js";

vi.mock("express-validator", async () => {
  const actual = await vi.importActual<typeof import("express-validator")>(
    "express-validator"
  );
  return {
    ...actual,
    matchedData: vi.fn(),
  };
});

interface MockRequest extends Partial<Request> {
  baseUserData: BaseUserData;
}

describe("updateBioAndSectionsController", () => {
  let req: MockRequest;
  let res: Partial<Response>;
  const matchedDataMock = matchedData as unknown as ReturnType<typeof vi.fn>;
  const executeMock = vi.spyOn(UpdateUserProfileUseCase.prototype, "execute");

  beforeEach(() => {
    req = {
      baseUserData: {
        id: "user123",
        role: "admin",
        name: "Test User",
        email: "test@example.com",
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    matchedDataMock.mockReturnValue({
      bio: "Updated bio",
      sections: [
        {
          id: 1,
          title: "Title",
          description: "Description",
          isPublic: true,
        },
      ],
    });

    executeMock.mockResolvedValue({
      newlyCreatedSections: [{ tempId: 9, newId: 99 }],
    });

    vi.clearAllMocks();
  });

  it("should return 200 and newly created sections", async () => {
    await updateBioAndSectionsController(req as Request, res as Response);

    expect(executeMock).toHaveBeenCalledWith(
      "Updated bio",
      [
        {
          id: 1,
          title: "Title",
          description: "Description",
          isPublic: true,
        },
      ],
      "user123",
      "admin"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Profile updated successfully!",
      newlyCreatedSections: [{ tempId: 9, newId: 99 }],
    });
  });

  it("should return 400 if role limit exceeded", async () => {
    req.baseUserData.role = "user";
    executeMock.mockRejectedValueOnce(
      new Error("LIMIT_EXCEEDED_FOR_USER_ROLE")
    );

    await updateBioAndSectionsController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "User role only can have one section",
    });
  });

  it("should return 500 on unknown error", async () => {
    executeMock.mockRejectedValueOnce(new Error("DB_CRASH"));

    await updateBioAndSectionsController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unexpected error updating profile",
    });
  });
});
