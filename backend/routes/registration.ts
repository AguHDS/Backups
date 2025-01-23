import express, { RequestHandler } from "express";
import register from "../controllers/registrationController";
import validatorRegistration from "../middlewares/validators/registration";

const router = express.Router();

router.post("/", validatorRegistration, register as RequestHandler);

export default router;
