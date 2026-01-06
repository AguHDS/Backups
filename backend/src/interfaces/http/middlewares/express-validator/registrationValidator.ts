import { check, ValidationChain } from "express-validator";

const validatorRegistration: ValidationChain[] = [
  check("user")
    .notEmpty()
    .withMessage("User cannot be empty")
    .isLength({ min: 1 })
    .withMessage("User should have at least 1 character")
    .matches(/^[a-zA-Z0-9-_ñ]+$/)
    .withMessage("You can only use letters and numbers"),
  check("password")
    .notEmpty()
    .withMessage("Password cannot be empty"),
  check("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Email is invalid"),
];

export default validatorRegistration;
