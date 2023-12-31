import express from "express";
import * as UserController from "src/controllers/user";
import * as UserValidator from "src/validators/user";

const router = express.Router();
router.post("/", UserValidator.createUser, UserController.createUser);

export default router;
