import "dotenv/config";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initializeSocket } from "./livechat-socketHandler/socketHandler.js";
import { createProxyMiddleware } from "http-proxy-middleware";

//routes
import { login, registration, verifyToken, logout } from "./routes/index.js";

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("Missing JWT secrets in environment variables");
}

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//middleware for cookies
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/login", login);
app.use("/registration", registration);

//verify if there is an auth token
app.use("/verify-token", verifyToken);

app.use("/logout", logout);

//proxy that redirects all the requests that aren't defined here to vite's port, so the front can handle them
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:5173",
    changeOrigin: true,
  })
);

const io = initializeSocket(server);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

const PORT = process.env.PORT_BACKEND || 3001;
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${PORT}`);
});
