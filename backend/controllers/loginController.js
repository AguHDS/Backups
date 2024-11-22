import connection from "../dbConnection/database.js";
import { validationResult, matchedData } from "express-validator";
import { compare } from "../utils/handlePassword.js";
import { tokenSign } from "../utils/handleJwt.js";

//localhost:3001/login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    const user = data.user;
    const pass = data.password;

    //check if the user exists in the database
    connection.query(
      "SELECT * FROM users WHERE namedb = ?",
      [user],
      async (error, results) => {
        if (error) {
          console.error(`Internal Server Error: ${error}`);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        //compares password sent by the user with the password in database
        if (results.length > 0) {
          const user_row = results[0];
          const comparedPassword = await compare(pass, user_row.passdb);

          if (comparedPassword) {
            const bodyWithRole = { ...data, role: user_row.role, id: user_row.id };

            const accessToken = await tokenSign(bodyWithRole, "access", "5m");
            const refreshToken = await tokenSign(bodyWithRole, "refresh", "7d");

            //check if the user already has a refresh token in the database
            connection.query(
              "SELECT * FROM refresh_tokens WHERE user_id = ?",
              [user_row.id],
              (error, tokenResults) => {
                if (error) {
                  console.log("Error checking refresh token:", error);
                  return res.status(500).json({
                    message: "Error saving refresh token in the database",
                  });
                }

                if (tokenResults.length > 0) {
                  console.log("User already has a refresh token in the database");
                  return res.status(400).json({
                    message: "User already has a refresh token",
                  });
                }

                //if no token exists, proceed to store it
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);

                connection.query(
                  "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
                  [user_row.id, refreshToken, expiresAt],
                  (error) => {
                    if (error) {
                      console.log("Error saving refresh token:", error);
                      return res.status(500).json({
                        message: "Error saving refresh token in the database",
                      });
                    }

                    res.cookie("refreshToken", refreshToken, {
                      httpOnly: true,
                      secure: process.env.NODE_ENV === "production",
                      maxAge: 7 * 24 * 60 * 60 * 1000,
                      sameSite: "Strict",
                    });

                    console.log(
                      `Login successful as: user: ${user}, role: ${user_row.role}, id: ${user_row.id}`
                    );

                    return res.status(200).json({
                      accessToken,
                      user: { name: user, role: user_row.role, id: user_row.id },
                    });
                  }
                );
              }
            );
          } else {
            console.log(`Invalid credentials (user: ${user}, pass: ${pass})`);
            return res.status(401).json({ message: "Invalid credentials" });
          }
        } else {
          console.error(`Credentials don't exist`);
          console.log("Attempted login as:", `user: ${user}`, `pass: ${pass}`);
          return res.status(401).json({ message: "Credentials don't exist" });
        }
      }
    );
  } catch (error) {
    console.error('Error in login controller:', error);
    return res.status(401).json({ message: "Error trying to log in" });
  }
};


export default login;
