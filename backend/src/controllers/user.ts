import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import UserModel from "src/models/user";
import validationErrorParser from "src/util/validationErrorParser";

export const createUser: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  const { name, profilePictureURL } = req.body;

  try {
    validationErrorParser(errors);

    const user = await UserModel.create({
      name: name,
      profilePictureURL: profilePictureURL,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
