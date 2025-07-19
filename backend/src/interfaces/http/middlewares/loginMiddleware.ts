import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

/** Validates user data */
export const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(", ");
    console.error("Validation errors found:", messages);
    res.status(400).json({ message: messages });
    return;
  }

  const { user, password } = matchedData(req);

  //add to req object user data
  req.userAndPassword = { user, password };
  
  next();
}