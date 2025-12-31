import express from "express";
import { updateUserCredentialsController } from "../controllers/updateUserCredentialsController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requiredRole.js";

const router = express.Router();

/**
 * Updates user credentials (username, email, password)
 */
router.patch("/", requireAuth, requireRole(["admin"]), updateUserCredentialsController);

export default router;
