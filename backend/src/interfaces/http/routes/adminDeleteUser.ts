import express from "express";
import { deleteUserController } from "../controllers/deleteUserController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requiredRole.js";
import { deleteUserValidation } from "../middlewares/express-validator/deleteUserValidation.js";

const router = express.Router();

router.delete(
  "/",
  requireAuth,
  requireRole(["admin"]),
  deleteUserValidation,
  deleteUserController
);

export default router;
