import express, { Express, Response } from "express";
import cookieParser from "cookie-parser";

// cors
import cors from "cors";
import credentials from "./middlewares/corsCredentials.js";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import allowedOrigins from "../../config/allowedOrigins.js";

// routes
import {
  login,
  registration,
  logout,
  refreshToken,
  getProfile,
  updateBioAndSections,
  uploadFiles,
  profilePicture,
  deleteSections,
  storage,
  getStorage,
  dashboard,
  deleteFiles
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
app.use("/api/login", login);
app.use("/api/registration", registration);
app.use("/api/logout", logout);
app.use("/api/refreshToken", refreshToken);
app.use("/api/getProfile", getProfile);
app.use("/api/updateBioAndSections", updateBioAndSections);
app.use("/api/uploadFiles", uploadFiles);
app.use("/api/profilePicture", profilePicture);
app.use("/api/deleteSections", deleteSections);
app.use("/api/storage", storage);
app.use("/api/getStorage", getStorage);
app.use("/api/dashboard-summary", dashboard);
app.use("/api/deleteFiles", deleteFiles);

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
