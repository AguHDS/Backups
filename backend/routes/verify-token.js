import express from "express";
import authorizedUser from "../middlewares/authorization.js";
import validateUser from "../controllers/verifyTokenController.js";

const router = express.Router();

//verifies the token and if it's valid, it's going to be used to check if the refresh/jwt token are valid when a protected endpoint is consumed

router.get("/", authorizedUser, validateUser);

export default router;
