import config from "../config/environmentVars.js";

const allowedOrigins = [
  `http://localhost:${config.portFrontend}`,
  `http://localhost:${config.portBackend}`,
];

export default allowedOrigins;