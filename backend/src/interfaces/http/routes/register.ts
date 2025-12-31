import express from "express";
import validatorRegistration from "../middlewares/express-validator/registrationValidator.js";
import { registerUserMiddleware } from "../middlewares/registerUserMiddleware.js";
import { registerUserController } from "../controllers/registerUserController.js";

const router = express.Router();

router.post("/", validatorRegistration, registerUserMiddleware, registerUserController);

export default router;
