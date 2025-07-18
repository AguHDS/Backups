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
export const updateBioAndSectionsController = async (req: Request, res: Response) => {
  const cleanData: ProfileDataToUpdate = matchedData(req);
  const { id } = req.baseUserData;

  try {
    const { newlyCreatedSections } = await updateUserProfileUseCase.execute(cleanData.bio, cleanData.sections, id);

    console.log("Profile updated successfully!");

    res.status(200).json({ message: "Profile updated successfully!", newlyCreatedSections });
  } catch (error) {
    console.error("Failed to update profile", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
