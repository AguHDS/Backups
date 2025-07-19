import { Request, Response, NextFunction } from "express";
import allowedOrigins from "../../../config/allowedOrigins.js";

const credentials = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next(); // Always call next() to keep the flow.
};

export default credentials;
