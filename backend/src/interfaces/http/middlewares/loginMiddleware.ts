import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

export const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  //check if credentials are valid using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  //extract sanitized data
  const { user, password } = matchedData(req);

  //add to req object user's sanitized data
  req.validatedUserData = { user, password };
  
  next();
}