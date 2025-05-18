import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

/** Validates user data */
export const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { user, password } = matchedData(req);

  //add to req object user data
  req.userAndPassword = { user, password };
  
  next();
}