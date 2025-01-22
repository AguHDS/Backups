import config from "./environmentVars";

const allowedOrigins = [
  `http://localhost:${config.portFrontend}`,
  `http://localhost:${config.portBackend}`,
];

export default allowedOrigins;