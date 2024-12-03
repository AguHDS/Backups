import "dotenv/config";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";

//cors
import credentials from "./middlewares/credentials.js";
import corsOptions from "./config/corsOption.js";
import cors from "cors";

/* import { initializeSocket } from "./livechat-socketHandler/socketHandler.js"; */
import { createProxyMiddleware } from "http-proxy-middleware";

//routes
import {
  login,
  registration,
  logout,
  verifyToken,
  refreshToken,
} from "./routes/index.js";

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("Missing JWT secrets in environment variables");
}

//cfg
const app = express();
const server = http.createServer(app);
app.use(express.json());

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/login", login);
app.use("/registration", registration);
app.use("/logout", logout);

app.use("/refreshToken", refreshToken);
app.use("/verifyToken", verifyToken);

//proxy that redirects all the requests that aren't defined here to vite's port, so the front can handle them
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:5173",
    changeOrigin: true,
  })
);

/* const io = initializeSocket(server); */

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

const PORT = process.env.PORT_BACKEND || 3001;
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${PORT}`);
});
