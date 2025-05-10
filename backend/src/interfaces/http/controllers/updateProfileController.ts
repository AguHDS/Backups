import { RequestHandler } from "express";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { validationResult, matchedData } from "express-validator";
import promisePool from "../../../db/database.js";

const updateProfile = async (
  bio: string,
  sections: { title: string; description: string }[],
  id: string
) => {
  const connection: PoolConnection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    //update bio
    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE users_profile SET bio = ? WHERE fk_users_id = ?`,
      [bio, id]
    );

    if (result.affectedRows === 0) {
      throw new Error("No profile found for the given user ID");
    }

    //update sections array
    for (const section of sections) {
      await connection.execute<ResultSetHeader>(
        `UPDATE users_profile_sections 
         SET description = ? 
         WHERE fk_users_id = ? AND title = ?`,
        [section.description, id, section.title] //using title as identifer for each section
      );
    }
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Error updating profile", error);
    throw new Error("Error updating profile");
  } finally {
    connection.release();
  }
};

interface ProfileDataToUpdate {
  bio: string;
  sections: { title: string; description: string }[];
}

const updateProfileController: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors found", errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  console.log("Raw req.body:", JSON.stringify(req.body, null, 2));
  const cleanData = matchedData(req) as ProfileDataToUpdate;

  const { userId } = req.body;

  try {
    await updateProfile(cleanData.bio, cleanData.sections, userId);
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
