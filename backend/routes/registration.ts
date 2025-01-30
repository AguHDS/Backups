import express, { RequestHandler } from "express";
import register from "../controllers/registrationController.ts";
import validatorRegistration from "../middlewares/validators/registration.ts";

const router = express.Router();

router.post("/", validatorRegistration, register as RequestHandler);

export default router;
