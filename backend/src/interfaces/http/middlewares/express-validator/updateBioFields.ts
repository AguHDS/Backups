import { check, ValidationChain } from "express-validator";

const validatorUpdateBio: ValidationChain[] = [
  check("bio").trim().notEmpty().withMessage("Bio cannot be empty"),
];

export default validatorUpdateBio;
