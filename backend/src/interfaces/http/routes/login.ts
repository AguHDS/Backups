import express from "express";
import validatorLogin from "../middlewares/express-validator/loginValidator.js";
import { loginController } from "../controllers/loginController.js";
import { loginMiddleware } from "../middlewares/loginMiddleware.js";

const router = express.Router();

router.post("/", validatorLogin, loginMiddleware, loginController);

export default router;
