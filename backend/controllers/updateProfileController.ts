import { RequestHandler } from "express";
import { PoolConnection } from "mysql2/promise";
import { ResultSetHeader } from "mysql2";
import { validationResult, ValidationError, matchedData } from "express-validator";
import promisePool from "../db/database";

const updateProfile = async (bio: string, title: string, description: string, id: string): Promise<void> => {
  const connection: PoolConnection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE users_profile SET bio = ? WHERE fk_users_id = ?`,
      [bio, id]
    );

    if (result.affectedRows === 0)
      throw new Error("No profile found for the given user ID");

    const [result2] = await connection.execute<ResultSetHeader>(
      `UPDATE users_profile_sections SET title = ?, description = ? WHERE fk_users_id = ?`,
      [title, description, id]
    );

    if (result2.affectedRows === 0)
      throw new Error("No profile_sections found for the given user ID");

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Error updating profile", error);
    throw new Error("Error updating profile");
  } finally {
    connection.release();
  }
};

interface ProfileSection {
  title: string;
  description: string;
}

interface ProfileDataToUpdate {
  bio: string;
  sections: ProfileSection[];
}

const updateProfileController: RequestHandler<{}, { message: string } | { errors: ValidationError[] }, { userId: string }, {}> = 
async (req, res): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors found", errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const cleanData = matchedData(req) as ProfileDataToUpdate;
  console.log("cleanData (updateProfileController):", cleanData);

  const { userId } = req.body;

  try {
    await updateProfile(cleanData.bio, cleanData.sections[0].title, cleanData.sections[0].description, userId);
    console.log("Profile updated successfully!");

    res.status(200).json({ message: "Profile updated successfully!" });
    return;
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
    return;
  }
};

export default updateProfileController;
