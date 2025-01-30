import { Request, Response, NextFunction } from "express";
import allowedOrigins from "../config/allowedOrigins.ts";

const credentials = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
    return;
  }
  next();
};

export default credentials;
