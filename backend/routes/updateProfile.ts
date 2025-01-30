import express, { RequestHandler } from "express";
import updateProfileController from "../controllers/updateProfileController.ts";
import updateProfileMiddleware from "../middlewares/updateProfileMiddleware.ts";
import validatorUpdateProfile from "../middlewares/validators/updateProfileFields.ts";

const router = express.Router();

router.post("/:username", validatorUpdateProfile, updateProfileMiddleware as RequestHandler, updateProfileController as RequestHandler);

export default router;