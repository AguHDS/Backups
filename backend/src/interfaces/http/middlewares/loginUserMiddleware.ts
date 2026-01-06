import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

/** Validates and prepares login data */
export const loginUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((e) => e.msg);
    console.error("Validation errors found:", errorMessages.join(", "));
    
    res.status(400).json({ 
      message: errorMessages[0] || "Validation error",
      errors: errorMessages 
    });
    return;
  }

  const { user, password } = matchedData(req);

  req.userAndPassword = { user, password };

  next();
};