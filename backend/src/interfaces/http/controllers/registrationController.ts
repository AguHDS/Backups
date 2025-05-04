import { Request, Response } from "express";
import { encrypt } from "../../../infraestructure/auth/handlePassword.js";
import promisePool from "../../../db/database.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface NameAndEmailCheckResult {
  isTaken: boolean;
  userTaken: string | null;
  emailTaken: string | null;
}

interface UserRow extends RowDataPacket {
  namedb: string;
  emaildb: string;
}

const isNameOrEmailTaken = async (username: string, email: string): Promise<NameAndEmailCheckResult> => {
  try {
    const [results] = await promisePool.execute<UserRow[]>('SELECT namedb, emaildb FROM users WHERE namedb = ? OR emaildb = ?', 
    [username, email]);

    if (results.length > 0) {
      console.error("User or email already exists in the database");

      //check which specific values are taken
      const userTaken = results.some((row) => row.namedb === username) ? username : null;
      const emailTaken = results.some((row) => row.emaildb === email) ? email : null;

      return {
        isTaken: true,
        userTaken,
        emailTaken,
      };
    } else {
      return {
        isTaken: false,
        userTaken: null,
        emailTaken: null,
      };
    }
  } catch (error) {
    console.error("Error checking user or email existence", error);
    throw new Error("Error checking user existence in database");
  }
};

const insertNewUser = async (name: string, email: string, pass: string, role: string) => {
  const connection = await promisePool.getConnection();
  try {
    await connection .beginTransaction();

    //insert new user in users table
    const [userResult] = await connection.execute<ResultSetHeader>(
      "INSERT INTO users (namedb, emaildb, passdb, role) VALUES (?, ?, ?, ?)",
      [name, email, pass, role]
    );

    //add foreign key to users_profile table
    const userId = userResult.insertId;
    await connection.execute(
      "INSERT INTO users_profile (fk_users_id) VALUES (?)",
      [userId]
    );

    //add foreign key to users_profile_sections table
    await connection.execute(
      "INSERT INTO users_profile_sections (fk_users_id) VALUES (?)",
      [userId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Error adding new user and profile", error);
    throw new Error("Error adding new user and profile");
  } finally {
    connection.release();
  }
};

export const registerController = async (req: Request, res: Response) => {
  if (!req.sessionData) {
    res.status(500).json({ message: "Missing user data" });
    return;
  }

  const { name, email, password } = req.sessionData;

  try {
    const hashedPassword = await encrypt(password);
    const body = { name, email, hashedPassword };

    const nameAndEmail = await isNameOrEmailTaken(body.name, body.email);

    if (nameAndEmail.isTaken) {
      if (nameAndEmail.userTaken && !nameAndEmail.emailTaken) {
        console.error(`User ${body.name} already exists`);

        res.status(409).json({ message: `User is taken` });
        return;
      }

      if (!nameAndEmail.userTaken && nameAndEmail.emailTaken) {
        console.error(`Email ${body.email} already exists`);

        res.status(409).json({ message: `Email is taken` });
        return;
      }

      if (nameAndEmail.userTaken && nameAndEmail.emailTaken) {
        console.error(`User ${body.name} and ${body.email} already exist`);

        res.status(409).json({ message: "The user and email are taken" });
        return;
      }
    }

    //if not taken, proceed with registration
    await insertNewUser(body.name, body.email, body.hashedPassword, "user");
    console.log(`User: ${body.name} and email: ${body.email} saved successfully`);

    res.status(200).json({ message: "Registration completed" });
    return;
  } catch (error) {
    console.error("Unexpected error", error);

    res.status(500).json({ message: "Error trying to sign up" });
    return;
  }
};