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
    const pass = data.password; //luego verificar que quien se loguea es un user (si tiene el rol y si lo tiene mostrarle el main content)

    connection.query(
      "SELECT namedb, passdb, role FROM users WHERE namedb = ?",
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
            console.log(`Login successful as: ${user}`);
            const bodyWithRole = { ...data, role: row.role };
            const token = await tokenSign(bodyWithRole);

            res.cookie("authToken", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production", //secure is a boolean, if its value isn't 'production', it will be false and the cookie won't be secure.
              maxAge: 2 * 60 * 60 * 1000,
              sameSite: "Strict",
            });

            return res.status(200).send({ msg: `Login successful as ${user}` });
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
