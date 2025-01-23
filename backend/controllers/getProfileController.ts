import promisePool from "../db/database";

//get user profile data from users_profile table
const getUserProfileById = async (id) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT bio, profile_pic, partner, friends FROM users_profile WHERE fk_users_id = ?",
      [id]
    );

    if (rows.length === 0) {
      console.error(`Data for id ${id} not found in users_prfile table`);
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error retrieving user from database:", error);
    throw new Error("Error retrieving user from database");
  }
};

const getUserSectionById = async (id) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT title, description FROM users_profile_sections WHERE fk_users_id = ?",
      [id]
    );

    if (rows.length === 0) {
      console.error(
        `Sections data for id ${id} not found in users_prfile_sections table`
      );
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error retrieving user section data from database:", error);
    throw new Error("Error retrieving user section data from database");
  }
};

/* sends to the client profile information of the user provided in the params of the url, comparing its id from users table 
with fk_users_id in users_profile table */
const getProfileController = async (req, res) => {
  try {
    const { username, role, id } = req.userData;

    const userProfileData = await getUserProfileById(id);
    const userSectionData = await getUserSectionById(id);

    if (userProfileData === null)
      return res.status(404).json({
        message: `Profile data not found for ${username} in users_profile table`,
      });
      console.log(userSectionData)

    const userData = {
      ...userProfileData,
      username,
      role,
      id,
      sections: userSectionData,
    };

    return res.status(200).json({ userData });
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return res.status(500).json({ message: "Failed to get user profile" });
  }
};

export default getProfileController;