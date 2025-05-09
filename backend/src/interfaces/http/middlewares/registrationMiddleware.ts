import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";
import { UserSession } from "../../../shared/dtos/userDto.js";

export const registrationMiddleware = (req: Request, res: Response, next: NextFunction): void  => {
const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors found", errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: UserSession = matchedData(req);

    const { name, email, password } = data;

    //save user data in req object
    req.sessionData = {
      name,
      email,
      password,
    }
    
    next();
}