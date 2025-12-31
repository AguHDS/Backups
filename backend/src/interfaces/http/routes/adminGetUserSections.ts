import express from "express";
import { getUserSectionsController } from "../controllers/getUserSectionsController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requiredRole.js";

const router = express.Router();

/**
 * Retrieves all sections for a specific user
 */
router.get("/:userId/sections", requireAuth, requireRole(["admin"]), getUserSectionsController);

export default router;
