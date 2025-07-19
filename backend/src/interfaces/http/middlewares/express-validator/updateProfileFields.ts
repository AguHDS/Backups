import { check, ValidationChain } from "express-validator";

const validatorUpdateProfile: ValidationChain[] = [
  check("bio").trim().notEmpty().withMessage("Bio cannot be empty"),

  check("sections")
    .isArray()
    .withMessage("Sections must be an array"),

  check("sections.*.title")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  check("sections.*.description")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  check("sections.*.isPublic")
    .isBoolean()
    .withMessage("isPublic must be a boolean"),
];

export default validatorUpdateProfile;
