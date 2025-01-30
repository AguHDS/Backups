import { RequestHandler, Request, Response } from "express";
import promisePool from "../db/database";
import { RowDataPacket } from "mysql2/promise";

interface ProfileContent {
  bio: string;
  profile_pic?: string;
  partner: string;
  friends: number;
}

//get user profile data from users_profile table
const getUserProfileById = async (id: number): Promise<ProfileContent | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[]>(
      "SELECT bio, profile_pic, partner, friends FROM users_profile WHERE fk_users_id = ?",
      [id]
    );

    if (rows.length === 0) {
      console.error(`Data for id ${id} not found in users_prfile table`);
      return null;
    }

    const row = rows[0];
    return {
      bio: row.bio,
      profile_pic: row.profile_pic,
      partner: row.partner,
      friends: row.friends,
    };
  } catch (error) {
    console.error("Error retrieving user from database:", error);
    throw new Error("Error retrieving user from database");
  }
};

interface ProfileSection {
  title: string;
  description: string;
}

const getUserSectionById = async (id: number): Promise<ProfileSection | null>=> {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[]>(
      "SELECT title, description FROM users_profile_sections WHERE fk_users_id = ?",
      [id]
    );

    if (rows.length === 0) {
      console.error(
        `Sections data for id ${id} not found in users_prfile_sections table`
      );
      return null;
    }

    const row = rows[0];
    return {
      title: row.title,
      description: row.description,
    };
  } catch (error) {
    console.error("Error retrieving user section data from database:", error);
    throw new Error("Error retrieving user section data from database");
  }
};

interface CustomResponse {
  username: string;
  role: string;
  id: number;
  userProfileData: ProfileContent;
  userSectionData: ProfileSection;
}

declare module "express-serve-static-core" {
  interface Request {
    userData: {
      username: string;
      role: string;
      id: number;
    };
  }
}

/* sends to the client profile information of the user provided in the params of the url, comparing its id from users table 
with fk_users_id in users_profile table */
const getProfileController = async (req: Request, res: Response) => {
  try {
    const { userData } = req;
    if (!userData) {
      res.status(400).json({ message: "User data is missing in the request" });
      return;
    }

    const { username, role, id } = userData;

    const userProfileData = await getUserProfileById(id);
    const userSectionData = await getUserSectionById(id);

    if (!userProfileData || !userSectionData) {
      res.status(404).json({ message: `Profile data not found for user ${username}` });
      return;
    }

    const profile: CustomResponse = {
      username,
      role,
      id,
      userProfileData,
      userSectionData,
    };

    res.status(200).json(profile);
    return;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    res.status(500).json({ message: "Failed to get user profile" });
    return;
  }
};

export default getProfileController;
