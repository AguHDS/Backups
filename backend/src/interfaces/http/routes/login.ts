import express from "express";
import { loginController } from "../controllers/loginController.js";
import { loginMiddleware } from "../middlewares/loginMiddleware.js";
import validatorLogin from "../middlewares/validators/loginValidator.js";

const router = express.Router();

router.post("/", validatorLogin, loginMiddleware, loginController);

export default router;
