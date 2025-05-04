import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

export const registrationMiddleware = (req: Request, res: Response, next: NextFunction)=> {
const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors found", errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: UserData = matchedData(req);
}