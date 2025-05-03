import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { matchedData } from "express-validator";

export const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { user, password } = matchedData(req);

  //add to req object user's valited data
  req.validatedUserData = { user, password };
  next();
}