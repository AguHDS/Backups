import "dotenv/config";
import http from "http";
import config from "./infraestructure/config/environmentVars.js";
import app from "./interfaces/http/server.js";

const server: http.Server = http.createServer(app);

server.listen(`${config.portBackend}`, () => {
  console.log(`Listening on: http://localhost:3001`);
});
