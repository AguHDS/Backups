import promisePool from "../db/database.js";
import { validationResult, matchedData } from "express-validator";

const updateProfile = async (bio, title, description, id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `UPDATE users_profile SET bio = ? WHERE fk_users_id = ?`,
      [bio, id]
    );

    if (result.affectedRows === 0)
      throw new Error("No profile found for the given user ID");

    const [result2] = await connection.query(
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

const updateProfileController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors found", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const cleanData = matchedData(req);
  console.log("data limpia:", cleanData);

  const { id } = req.body.userId;

  try {
    await updateProfile(
      cleanData.bio,
      cleanData.sections[0].title,
      cleanData.sections[0].description,
      id
    );
    console.log("Profile updated successfully!");

    return res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

export default updateProfileController;
