import config from "../infraestructure/config/environmentVars.js";

const allowedOrigins: string[] = [
  `http://localhost:${config.portFrontend}`,
  `http://localhost:${config.portBackend}`,
];

export default allowedOrigins;