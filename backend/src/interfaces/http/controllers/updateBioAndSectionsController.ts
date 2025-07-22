import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { UpdateUserProfileUseCase } from "../../../application/useCases/UpdateUserProfileUseCase.js";
import { MysqlProfileRepository } from "../../../infraestructure/adapters/repositories/MysqlProfileRepository.js";

const updateUserProfileUseCase = new UpdateUserProfileUseCase(
  new MysqlProfileRepository()
);

interface ProfileDataToUpdate {
  bio: string;
  sections: {
    id: number;
    title: string;
    description: string;
    isPublic: boolean;
  }[];
}

/** Updates bio and sections for specific user */
export const updateBioAndSectionsController = async (
  req: Request,
  res: Response
) => {
  const cleanData: ProfileDataToUpdate = matchedData(req);
  const { id, role } = req.baseUserData;

  try {
    const { newlyCreatedSections } = await updateUserProfileUseCase.execute(
      cleanData.bio,
      cleanData.sections,
      id,
      role
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully!", newlyCreatedSections });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (errorMessage === "LIMIT_EXCEEDED_FOR_USER_ROLE") {
      console.error("Users with role 'user' only can have one section");
      res.status(400).json({ message: "User role only can have one section" });
      return 
    }

    console.error("Unexpected error updating profile:", error);
    res.status(500).json({ message: "Unexpected error updating profile" });
  }
};