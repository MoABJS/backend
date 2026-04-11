import { body } from "express-validator";

const postValidation = [
  body("itemName")
    .trim()
    .notEmpty()
    .withMessage("Item name is required")
    .isString()
    .withMessage("Item name should be a string"),
  body("itemDescription")
    .trim()
    .notEmpty()
    .withMessage("Item description is required")
    .isString()
    .withMessage("Item description should be a string"),
  body("postType")
    .trim()
    .notEmpty()
    .withMessage("Post type is required")
    .isString()
    .withMessage("Post type should be a string")
    .isIn(["lost", "found"])
    .withMessage("Post type must be either lost or found"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isString()
    .withMessage("Location should be a string"),
  body("date")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("User Id is required")
    .isMongoId()
    .withMessage("User Id must be a valid MongoID"),
];

export default postValidation;
