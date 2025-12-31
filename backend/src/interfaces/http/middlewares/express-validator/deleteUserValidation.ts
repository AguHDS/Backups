import { body, ValidationChain } from "express-validator";

export const deleteUserValidation: ValidationChain[] = [
  body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isString()
    .withMessage("userId must be a string"),
];
