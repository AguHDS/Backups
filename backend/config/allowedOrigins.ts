import config from "./environmentVars";

const allowedOrigins: string[] = [
  `http://localhost:${config.portFrontend}`,
  `http://localhost:${config.portBackend}`,
];

export default allowedOrigins;