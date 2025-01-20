import express from "express";
import updateProfileController from "../controllers/updateProfileController.js";
import updateProfileMiddleware from "../middlewares/updateProfileMiddleware.js";
import validatorUpdateProfile from "../middlewares/validators/updateProfileFields.js";

const router = express.Router();

router.post("/:username", validatorUpdateProfile, updateProfileMiddleware,  updateProfileController);

export default router;