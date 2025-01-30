import { RequestHandler } from "express";
import { validationResult, matchedData, ValidationError } from "express-validator";
import { encrypt } from "../utils/handlePassword";
import promisePool from "../db/database";
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

interface UserData {
  user: string;
  password: string
  email: string;
}

const register: RequestHandler<{}, { message: string } | { errors: ValidationError[] }, UserData, {}> = 
async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors found", errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: UserData = matchedData(req);
    const password = await encrypt(data.password);
    const body = { ...data, password };

    const nameAndEmail = await isNameOrEmailTaken(body.user, body.email);

    if (nameAndEmail.isTaken) {
      if (nameAndEmail.userTaken && !nameAndEmail.emailTaken) {
        console.error(`User ${body.user} already exists`);

        res.status(409).json({ message: `User is taken` });
        return;
      }

      if (!nameAndEmail.userTaken && nameAndEmail.emailTaken) {
        console.error(`Email ${body.email} already exists`);

        res.status(409).json({ message: `Email is taken` });
        return;
      }

      if (nameAndEmail.userTaken && nameAndEmail.emailTaken) {
        console.error(`User ${body.user} and ${body.email} already exist`);

        res.status(409).json({ message: "The user and email are taken" });
        return;
      }
    }

    //if not taken, proceed with registration
    await insertNewUser(body.user, body.email, body.password, "user");
    console.log(`User: ${body.user} and email: ${body.email} saved successfully`);

    res.status(200).json({ message: "Registration completed" });
    return;
  } catch (error) {
    console.error("Unexpected error", error);

    res.status(500).json({ message: "Error trying to sign up" });
    return;
  }
};

export default register;
