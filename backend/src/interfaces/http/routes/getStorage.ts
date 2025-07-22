import express from "express";
import { getStorageUsageController } from "../controllers/getStorageUsageController.js";

const router = express.Router();

router.get("/:username", getStorageUsageController);

export default router;