import "dotenv/config";
import config from "./config/environmentVars";
import express, { Express, Request, Response } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import { closeDatabasePool } from "./db/database";

//cors
import credentials from "./middlewares/credentials";
import corsOptions from "./config/corsOption";
import cors from "cors";

/* import { initializeSocket } from "./livechat-socketHandler/socketHandler.ts"; */
import { createProxyMiddleware, Options } from "http-proxy-middleware";

//routes
import {
  login,
  registration,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
} from "./routes/index";

//cfg
const app: Express = express();
const server: http.Server = http.createServer(app);
app.use(express.json());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
//auth
app.use("/login", login);
app.use("/registration", registration);
app.use("/logout", logout);
app.use("/refreshToken", refreshToken);
//profile
app.use("/api/getProfile", getProfile);
app.use("/api/updateProfile", updateProfile);

//proxy that redirects all the requests that aren't defined here to vite's port, so the front can handle them
app.use(
  "/",
  createProxyMiddleware({
    target: `http://localhost:${config.portFrontend}`,
    changeOrigin: true,
  } as Options)
);

/* const io = initializeSocket(server); */

app.get("/favicon.ico", (req: Request, res: Response) => {
  res.status(204).end();
});

//close connection pool when app is closed
const shutDown = async ()=> {
  console.log("Closing connection pool to db");
  try {
    await closeDatabasePool();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};
//ctrl + c
process.on("SIGINT", shutDown);
//for docker and production
process.on("SIGTERM", shutDown);

server.listen(`${config.portBackend}`, () => {
  console.log(`Listening on: http://localhost:${config.portBackend}`);
});
