import { Request, Response } from "express";
import { MysqlProfileRepository } from "../../../infraestructure/repositories/MysqlProfileRepository.js";
import { GetUserProfileUseCase } from "../../../application/useCases/GetUserProfileUseCase.js";
import { CustomResponse } from "../.././../shared/dtos/index.js";

const getUserProfileUseCase = new GetUserProfileUseCase(
  new MysqlProfileRepository()
);

/**  Respond with user profile data, comparing its id from users table with fk_users_id in users_profile table */
export const getProfileController = async (req: Request, res: Response) => {
  try {
    const { name, role, id } = req.baseUserData;

    const profile = await getUserProfileUseCase.execute(id);

    //in the future we will need to include sections id and files
    const response: CustomResponse = {
      name,
      role,
      id,
      userProfileData: {
        bio: profile.bio,
        profile_pic: profile.profilePic,
        partner: profile.partner,
        friends: profile.friendsCount,
      },
      userSectionData:
        profile.sections?.map((section) => ({
          title: section.title,
          description: section.description,
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
