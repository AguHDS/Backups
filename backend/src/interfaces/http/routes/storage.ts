import express from "express";
import { storageManagerController } from "../controllers/storageManagerController.js";
// import { updateStorageQuotaController } from "../controllers/updateStorageQuotaController.js";
import { refreshTokenMiddleware } from "../middlewares/refreshTokenMiddleware.js";

const router = express.Router();

router.get("/", refreshTokenMiddleware, storageManagerController);
// router.patch("/", refreshTokenMiddleware, updateStorageQuotaController);

export default router;