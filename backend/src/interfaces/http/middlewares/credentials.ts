import { Request, Response, NextFunction } from "express";
import allowedOrigins from "../config/allowedOrigins.js";

const credentials = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next(); // Siempre llama a next() para continuar con el flujo
};

export default credentials;
