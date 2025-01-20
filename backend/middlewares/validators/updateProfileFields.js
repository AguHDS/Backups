import { check } from "express-validator";

const validatorUpdateProfile = [
  check("bio")
    .trim()
    .notEmpty()
    .withMessage("Bio cannot be empty"),
  check("sections.*.title")
    .trim()
    .notEmpty()
    .withMessage("Section title cannot be empty"),
  check("sections.*.description")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
];

export default validatorUpdateProfile;
