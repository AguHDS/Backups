import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

/** Validations before registering a user */
export const registrationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(", ");
    console.error("Validation errors found:", messages);
    res.status(400).json({ message: messages });
    return;
  }

  const data = matchedData(req);

  const { user, email, password } = data;

  //save user data in req object
  req.userSession = {
    user,
    email,
    password,
  };

  next();
};
