import express, { RequestHandler } from "express";
import updateProfileController from "../controllers/updateProfileController";
import updateProfileMiddleware from "../middlewares/updateProfileMiddleware";
import validatorUpdateProfile from "../middlewares/validators/updateProfileFields";

const router = express.Router();

router.post("/:username", validatorUpdateProfile, updateProfileMiddleware as RequestHandler, updateProfileController as RequestHandler);

export default router;