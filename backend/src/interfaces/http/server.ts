import express, { Express, Response } from "express";
import cookieParser from "cookie-parser";
/* import { initializeSocket } from "./livechat-socketHandler/socketHandler.ts"; */

//cors
import cors from "cors";
import credentials from "./middlewares/corsCredentials.js";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import allowedOrigins from "../../config/allowedOrigins.js";

//routes
import {
  login,
  registration,
  logout,
  refreshToken,
  getProfile,
  updateBioAndSections,
  uploadFiles,
  deleteSections,
  deleteFiles
} from "./routes/index.js";

const app: Express = express();

//CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Habilitar envío de cookies
  })
);

//middlewares
app.use(express.json());
app.use(credentials);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//API routes
app.use("/api/login", login);
app.use("/api/registration", registration);
app.use("/api/logout", logout);
app.use("/api/refreshToken", refreshToken);
app.use("/api/getProfile", getProfile);
app.use("/api/updateBioAndSections", updateBioAndSections);
app.use("/api/uploadFiles", uploadFiles);
app.use("/api/deleteSections", deleteSections);
app.use("/api/deleteFiles", deleteFiles);

//proxy to redirect all requests that aren't defined here to vite's port, so the client can handle them
app.use(
  "/",
  createProxyMiddleware({
    target: `http://localhost:5173`,
    changeOrigin: true,
  } as Options)
);

/* const io = initializeSocket(server); */

app.get("/favicon.ico", (req, res: Response) => {
  res.status(204).end();
});

export default app;