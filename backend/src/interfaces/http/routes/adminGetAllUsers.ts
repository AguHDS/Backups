import express from "express";
import { getAllUsersController } from "../controllers/getAllUsersController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requiredRole.js";

const router = express.Router();

/**
 * GET /api/admin/users
 * Retrieves all users from the database
 * Requires authentication and admin role
 */
router.get("/", requireAuth, requireRole(["admin"]), getAllUsersController);

export default router;
