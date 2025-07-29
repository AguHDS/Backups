import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { mockRequest, mockResponse } from "jest-mock-req-res";
import { Request, Response } from "express";
import { getProfileController } from "@/interfaces/http/controllers/getProfileController.js";
import { decodeRefreshToken } from "@/shared/utils/decodeRefreshToken.js";
import { GetUserProfileUseCase } from "@/application/useCases/GetUserProfileUseCase.js";
import { UserProfile } from "@/domain/entities/UserProfile.js";
import { UserProfileSection } from "@/domain/entities/UserProfileSection.js";
import { UserFile } from "@/domain/entities/UserFile.js";

vi.mock("@/shared/utils/decodeRefreshToken.js", () => ({
  decodeRefreshToken: vi.fn(),
}));

describe("getProfileController", () => {
  let req: Request;
  let res: Response;
  let fakeExecute: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    req = mockRequest({
      params: { username: "testUser" },
      baseUserData: {
        id: 123,
        name: "Test",
        email: "test@email.com",
        role: "user",
      },
      cookies: { refreshToken: "valid.token" },
    }) as unknown as Request;

    res = mockResponse() as unknown as Response;

    const file = new UserFile(
      "img123",
      "https://cdn.com/image.jpg",
      "1",
      2048,
      123
    );

    const section = new UserProfileSection(
      1,
      "Projects",
      "My projects",
      [file],
      true
    );

    const profile = new UserProfile(
      123,
      "This is my profile",
      10,
      "profile-pic.jpg",
      "Sofia",
      [section]
    );

    fakeExecute = vi
      .spyOn(GetUserProfileUseCase.prototype, "executeByUsername")
      .mockResolvedValue({ isOwner: true, profile });

    (decodeRefreshToken as ReturnType<typeof vi.fn>).mockReturnValue({
      id: "123",
      name: "Test",
      role: "user",
      iat: 123456,
      exp: 123999,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should respond 200 if profile data is correct", async () => {
    await getProfileController(req, res);

    expect(fakeExecute).toHaveBeenCalledWith("testUser", 123);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      username: "Test",
      id: 123,
      email: "test@email.com",
      role: "user",
      isOwner: true,
      userProfileData: {
        bio: "This is my profile",
        profile_pic: "profile-pic.jpg",
        partner: "Sofia",
        friends: 10,
      },
      userSectionData: [
        {
          id: 1,
          title: "Projects",
          description: "My projects",
          isPublic: true,
          files: [
            {
              url: "https://cdn.com/image.jpg",
              publicId: "img123",
              sectionId: 1,
              sizeInBytes: 2048,
              userId: 123,
            },
          ],
        },
      ],
    });
  });

  it("should respond 404 if profile doesn't exist", async () => {
    fakeExecute.mockRejectedValueOnce(new Error("PROFILE_NOT_FOUND"));

    await getProfileController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Profile not found" });
  });

  it("should respond 500 if there is an unexpected error", async () => {
    fakeExecute.mockRejectedValueOnce(new Error("DB_FAIL"));

    await getProfileController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to get user profile",
    });
  });

  it("should use requesterId = null if there is not refresh token", async () => {
    (decodeRefreshToken as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("NO_REFRESH_TOKEN");
    });

    await getProfileController(req, res);

    expect(fakeExecute).toHaveBeenCalledWith("testUser", null);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
