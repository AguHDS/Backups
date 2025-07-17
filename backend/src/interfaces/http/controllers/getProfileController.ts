import { Request, Response } from "express";
import { MysqlProfileRepository } from "../../../infraestructure/adapters/repositories/MysqlProfileRepository.js";
import { GetUserProfileUseCase } from "../../../application/useCases/GetUserProfileUseCase.js";
import { CustomResponse } from "../.././../shared/dtos/index.js";
import { MysqlFileRepository } from "../../../infraestructure/adapters/repositories/MysqlFileRepository.js";
import { decodeRefreshToken } from "../../../shared/utils/decodeRefreshToken.js";

const getUserProfileUseCase = new GetUserProfileUseCase(
  new MysqlProfileRepository(),
  new MysqlFileRepository()
);

/** Respond with user profile data, comparing its id from users table with fk_users_id in users_profile table */
export const getProfileController = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    // Profile owner's data
    const { name, role, id, email } = req.baseUserData;

    let requesterId: number | null = null;

    try {
      // Get logged user's id for profile ownership validation
      const decoded = decodeRefreshToken(req);
      requesterId = Number(decoded.id);
    } catch (err) {
      requesterId = null;
    }

    const { profile, isOwner } = await getUserProfileUseCase.executeByUsername(username, requesterId);

    const response: CustomResponse = {
      username: name,
      role,
      id,
      email,
      isOwner,
      userProfileData: {
        bio: profile.bio,
        profile_pic: profile.profilePic,
        partner: profile.partner,
        friends: profile.friendsCount,
      },
      userSectionData:
        profile.sections?.map((section) => ({
          id: section.id,
          title: section.title,
          description: section.description,
          isPublic: section.isPublic,
          files:
            section.files?.map((file) => ({
              url: file.url,
              publicId: file.publicId,
            })) ?? [],
        })) ?? [],
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error)
      console.error("Failed to get user profile:", error);

    switch (error.message) {
      case "PROFILE_NOT_FOUND":
        res.status(404).json({ message: "Profile not found" });
        return;
      default:
        res.status(500).json({ message: "Failed to get user profile" });
        return;
    }
  }
};
