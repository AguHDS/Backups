import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";
import { UserSession } from "../../../shared/dtos/userSession.js";

export const registrationMiddleware = (req: Request, res: Response, next: NextFunction)  => {
const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors found", errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: UserSession = matchedData(req);

    const { name, email, password } = data;

    req.sessionData = {
      name,
      email,
      password,
    }

    next();
}