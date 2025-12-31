import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

/** Validates and prepares registration data */
export const registerUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(", ");
    console.error("Validation errors found:", messages);
    res.status(400).json({ message: messages });
    return;
  }

  const data = matchedData(req);
  const { user, email, password } = data;

  // Save user data in req object for controller
  req.userSession = {
    user,
    email,
    password,
  };

  next();
};
