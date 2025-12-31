import express from "express";
import validatorLogin from "../middlewares/express-validator/loginValidator.js";
import { loginUserMiddleware } from "../middlewares/loginUserMiddleware.js";
import { loginUserController } from "../controllers/loginUserController.js";

const router = express.Router();

router.post("/", validatorLogin, loginUserMiddleware, loginUserController);

export default router;
