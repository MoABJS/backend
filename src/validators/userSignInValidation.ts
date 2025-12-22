import { body } from "express-validator";

const userSignInValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email field is required")
    .isEmail()
    .withMessage("input a correct email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password field is required")
    .isString()
    .withMessage("Password should be a string"),
];

export default userSignInValidation;
