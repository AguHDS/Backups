import connection from "../dbConnection/database.js";
import { validationResult, matchedData } from "express-validator";
import handleHttpError from "../utils/handleError.js";
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

    connection.query(
      "SELECT * FROM users WHERE namedb = ?",
      [user],
      async (error, results) => {
        if (error) {
          console.error(`Internal Server Error: ${error}`);

          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.length > 0) {
          const row = results[0];
          const comparedPassword = await compare(pass, row.passdb);

          if (comparedPassword) {
            const bodyWithRole = { ...data, role: row.role };
            const accessToken = await tokenSign(bodyWithRole, "access", "5m");
            const refreshToken = await tokenSign(bodyWithRole, "refresh", "7d");

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

            connection.query(
              "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,?)",
              [row.id, refreshToken, expiresAt],
              (error) => {
                if (error) {
                  console.log(
                    "Error saving refresh token in the database",
                    error
                  );

                  return res.status(500).json({
                    message: "Error saving refresh token in the database",
                  });
                }

                res.cookie("refreshToken", refreshToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                  sameSite: "Strict",
                });

                console.log(
                  `login successful as: user: ${user}, role: ${row.role}`
                );

                return res.status(200).json({
                  accessToken: accessToken,
                  //take in account that i'm sending the role and name direclty from the database and not the token
                  user: { name: user, role: row.role },
                });
              }
            );
          } else {
            console.log(`Invalid credentials (user: ${user}, pass: ${pass})`);

            return res.status(401).json({ message: "Invalid credentials" });
          }
        } else {
          console.log(`Credentials donesn't exist`);
          console.log("Attempted login as: ", `user: ${user}`, `pass: ${pass}`);
          return res.status(401).json({ message: "Credentials doesn't exist" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    handleHttpError(res, "Error while loggin");
  }
};

export default login;

//el try catch no puede ser usado dentro de la query porque el try catch espera errores sincronos, y la query es asincrona
//el codigo que maneja el try-catch (fuera de la query) es sincrono, porque recibimos de forma asincrona los datos del cliente pero lo que hace el codigo una vez los obtiene se hace de forma síncrona
