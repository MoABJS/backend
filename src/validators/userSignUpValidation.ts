import { body } from "express-validator";

const userSignUpValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name field is required")
    .isString()
    .withMessage("First name should be a string"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name field is required")
    .isString()
    .withMessage("Last name should be a string"),
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

export default userSignUpValidation;
