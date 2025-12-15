import { Request, Response } from "express";
import { MysqlProfileRepository } from "../../../infraestructure/adapters/repositories/MysqlProfileRepository.js";
import { GetUserProfileUseCase } from "../../../application/useCases/GetUserProfileUseCase.js";
import { GetProfileResponse } from "../.././../shared/dtos/index.js";
import { MysqlFileRepository } from "../../../infraestructure/adapters/repositories/MysqlFileRepository.js";
import { decodeRefreshToken } from "../../../shared/utils/decodeRefreshToken.js";

const getUserProfileUseCase = new GetUserProfileUseCase(
  new MysqlProfileRepository(),
  new MysqlFileRepository()
);

/** Respond with user profile data, comparing its id from users table with fk_users_id in users_profile table */
export const getProfileController = async (req: Request, res: Response) => {
  try {
    // Profile owner's data
    const { username } = req.params;
    if (!req.baseUserData) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { name, role, id, email } = req.baseUserData;

    let requesterId: number | null = null;

    try {
      // Get active user's id for profile ownership validation
      const decoded = decodeRefreshToken(req);
      requesterId = Number(decoded.id);
    } catch (err) {
      requesterId = null;
      console.error(err);
    }

    if (!requesterId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { profile, isOwner } = await getUserProfileUseCase.executeByUsername(
      username,
      requesterId
    );

    if (!email) {
      res.status(400).json({ message: "Incomplete user data" });
      return;
    }

    const response: GetProfileResponse = {
      username: name,
      role,
      id,
      email,
      isOwner,
      userProfileData: {
        bio: profile.bio,
        profile_pic: profile.profilePic,
        level: profile.level,
      },
      userSectionData:
        profile.sections?.map((section) => ({
          id: section.id,
          title: section.title,
          description: section.description,
          isPublic: section.isPublic,
          files:
            section.files?.map((file) => ({
              publicId: file.publicId,
              sectionId: section.id.toString(),
              sizeInBytes: file.sizeInBytes,
              userId: file.userId,
            })) ?? [],
        })) ?? [],
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to get user profile:", error);

    switch (errorMessage) {
      case "PROFILE_NOT_FOUND":
        res.status(404).json({ message: "Profile not found" });
        return;
      case "USER_NOT_FOUND":
        res.status(404).json({ message: "User not found" });
        return;
      case "UNAUTHORIZED":
        res.status(401).json({ message: "Unauthorized" });
        return;
      default:
        res.status(500).json({ message: "Failed to get user profile" });
        return;
    }
  }
};
