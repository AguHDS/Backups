import express from "express";
import { getDashboardController } from "../controllers/getDashboardController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getDashboardController);

export default router;