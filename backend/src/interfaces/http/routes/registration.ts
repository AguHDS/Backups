import express, { RequestHandler } from "express";
import register from "../controllers/registrationController.js";
import validatorRegistration from "../middlewares/validators/registration.js";

const router = express.Router();

router.post("/", validatorRegistration, register as RequestHandler);

export default router;
