import { body } from "express-validator";

const makeNameValidator = () =>
  body("name")
    // name must exist, if not this message will be displayed
    .exists()
    .withMessage("name is required")
    // bail prevents the remainder of the validation chain for this field from being executed if
    // there was an error
    .bail()
    .isString()
    .withMessage("name must be a string")
    .bail()
    .notEmpty()
    .withMessage("name cannot be empty");

const makeProfilePictureURLValidator = () =>
  body("profilePictureURL").optional().isString().withMessage("profilePictureURL must be a string");

export const createUser = [makeNameValidator(), makeProfilePictureURLValidator()];
