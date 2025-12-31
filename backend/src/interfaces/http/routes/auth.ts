import express from "express";
import { auth } from "@/lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import registerRouter from "./register.js";
import loginRouter from "./login.js";

const router = express.Router();

router.use("/register", registerRouter);
router.use("/login", loginRouter);

router.all("/*", toNodeHandler(auth));

export default router;
