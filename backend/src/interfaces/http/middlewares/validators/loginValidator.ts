import { check, ValidationChain } from "express-validator";

const validatorLogin: ValidationChain[] = [
  check("user")
    .notEmpty()
    .withMessage("User cannot be empty")
    .isLength({ min: 1 })
    .withMessage("Fields should have at least 1 character")
    .matches(/^[a-zA-Z0-9-_ñ]+$/)
    .withMessage("You can only use letters and numbers"),
  check("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Fields should have at least 1 character")
    .matches(/^[a-zA-Z0-9-_ñ]+$/)
    .withMessage("You can only use letters and numbers"),
];

export default validatorLogin;
