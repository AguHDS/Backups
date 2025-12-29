import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { UpdateBioUseCase } from "@/application/useCases/UpdateBioUseCase.js";
import { MysqlProfileRepository } from "@/infraestructure/adapters/repositories/MysqlProfileRepository.js";

const updateBioUseCase = new UpdateBioUseCase(new MysqlProfileRepository());

interface BioDataToUpdate {
  bio: string;
}

/** Updates bio for specific user */
export const updateBioController = async (req: Request, res: Response) => {
  const cleanData: BioDataToUpdate = matchedData(req);
  if (!req.baseUserData) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { id } = req.baseUserData;

  try {
    await updateBioUseCase.execute(cleanData.bio, id);

    res.status(200).json({ message: "Bio updated successfully!" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (errorMessage === "INVALID_BIO") {
      console.error("Invalid bio provided");
      res.status(400).json({ message: "Invalid bio" });
      return;
    }

    console.error("Unexpected error updating bio:", error);
    res.status(500).json({ message: "Unexpected error updating bio" });
  }
};
