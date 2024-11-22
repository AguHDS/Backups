import { tokenSign } from "../utils/handleJwt.js";

//send new access token if everything was validated
const sendNewAccessToken = async (req, res) => {
  try {
    const { id, name, role } = req.user;

    const accessToken = await tokenSign({ id, name, role }, "access", "5m");
    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(`Error trying to update the token. ${error}`);
  }
};

export default sendNewAccessToken;
