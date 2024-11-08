import express from "express";
import authorizedUser from "../middlewares/authorization.js";
import validateUser from "../controllers/verifyTokenController.js";

const router = express.Router();

router.get("/", authorizedUser, validateUser);

export default router;
