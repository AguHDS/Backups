import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { UpdateUserProfileUseCase } from "../../../application/useCases/UpdateUserProfileUseCase.js";
import { MysqlProfileRepository } from "../../../infraestructure/repositories/MysqlProfileRepository.js";

const updateUserProfileUseCase = new UpdateUserProfileUseCase(
  new MysqlProfileRepository()
);

interface ProfileDataToUpdate {
  bio: string;
  sections: {
    title: string;
    description: string;
  }[];
}

/** Updates bio and sections for specific user */
export const updateProfileController = async (req: Request, res: Response) => {
  const cleanData: ProfileDataToUpdate = matchedData(req);

  const { id } = req.refreshTokenId;

  try {
    await updateUserProfileUseCase.execute(cleanData.bio, cleanData.sections, id);
    console.log("Profile updated successfully!");

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    if (error instanceof Error) console.error("Error updating profile:", error);

    switch (error.message) {
      case "INVALID_BIO":
        res.status(400).json({ message: "Invalid bio format" });
        return;
      case "INVALID_SECTIONS":
        res.status(400).json({ message: "Invalid section format" });
        return;
    }

    res.status(500).json({ message: "Failed to update profile" });
  }
};
