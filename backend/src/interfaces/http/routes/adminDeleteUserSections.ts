import express from "express";
import { deleteUserSectionsController } from "../controllers/deleteUserSectionsController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requiredRole.js";

const router = express.Router();

/**
 * Deletes specific sections for any user
 */
router.delete("/", requireAuth, requireRole(["admin"]), deleteUserSectionsController);

export default router;
