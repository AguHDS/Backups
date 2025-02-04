import "dotenv/config";
import config from "./config/environmentVars.js";
import express, { Express, Response } from "express";
import http from "http";
import cookieParser from "cookie-parser";
/* import { initializeSocket } from "./livechat-socketHandler/socketHandler.ts"; */

//cors
import cors from "cors";
import credentials from "./middlewares/credentials.js";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import allowedOrigins from "./config/allowedOrigins.js";

//routes
import {
  login,
  registration,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
} from "./routes/index.js";

//cfg
const app: Express = express();
const server: http.Server = http.createServer(app);
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

app.use(express.json());
app.use(credentials);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/login", login);
app.use("/registration", registration);
app.use("/logout", logout);
app.use("/refreshToken", refreshToken);
app.use("/api/getProfile", getProfile);
app.use("/api/updateProfile", updateProfile);

//proxy that redirects all the requests that aren't defined here to vite's port, so the front can handle them
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

server.listen(`${config.portBackend}`, () => {
  console.log(`Listening on: http://localhost:3001`);
});
