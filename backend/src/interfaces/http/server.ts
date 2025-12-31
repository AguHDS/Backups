import express, { Express, Response } from "express";
import cookieParser from "cookie-parser";

// cors
import cors from "cors";
import credentials from "./middlewares/corsCredentials.js";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import allowedOrigins from "../../config/allowedOrigins.js";

// routes
import auth from "./routes/auth.js";
import {
  getProfile,
  updateBio,
  updateSections,
  uploadFiles,
  profilePicture,
  deleteSections,
  getStorage,
  dashboard,
  deleteFiles,
  adminDeleteUser,
  adminGetAllUsers
} from "./routes/index.js";

const app: Express = express();

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// middlewares
app.use(express.json());
app.use(credentials);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
// BetterAuth routes (handles /api/auth/*)
app.use("/api/auth", auth);

// Other API routes
app.use("/api/getProfile", getProfile);
app.use("/api/updateBio", updateBio);
app.use("/api/updateSections", updateSections);
app.use("/api/uploadFiles", uploadFiles);
app.use("/api/profilePicture", profilePicture);
app.use("/api/deleteSections", deleteSections);
app.use("/api/getStorage", getStorage);
app.use("/api/dashboard-summary", dashboard);
app.use("/api/deleteFiles", deleteFiles);

// Admin routes
app.use("/api/admin/deleteUser", adminDeleteUser);
app.use("/api/admin/users", adminGetAllUsers);

const VITE_PORT =
  process.env.NODE_ENV === "preview" ? 4173 : 5173;

app.use(
  "/",
  createProxyMiddleware({
    target: `http://localhost:${VITE_PORT}`,
    changeOrigin: true,
  } as Options)
);

app.get("/favicon.ico", (req, res: Response) => {
  res.status(204).end();
});

export default app;
