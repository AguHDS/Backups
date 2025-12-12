import config from "../infraestructure/config/environmentVars.js";

const allowedOrigins: string[] = [
  `http://localhost:${config.portFrontend}`, // 5173 dev frontend
  `http://localhost:${config.portBackend}`, // 3001 backend
  `http://localhost:4173`, // preview
];

export default allowedOrigins;
