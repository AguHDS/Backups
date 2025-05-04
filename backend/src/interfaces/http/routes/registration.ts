import express from "express";
import validatorRegistration from "../middlewares/validators/registrationValidator.js";
import { registerController } from "../controllers/registrationController.js";
import { registrationMiddleware } from "../middlewares/registrationMiddleware.js";

const router = express.Router();

router.post("/", validatorRegistration, registrationMiddleware, registerController);

export default router;
