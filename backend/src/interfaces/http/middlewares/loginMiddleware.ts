import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

/** Validate user data */
export const loginMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { user, password } = matchedData(req);

  //add to req object user data
  req.validatedUserData = { user, password };
  
  next();
}