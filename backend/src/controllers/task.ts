/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import TaskModel from "src/models/task";
import UserModel from "src/models/user";
import validationErrorParser from "src/util/validationErrorParser";
import { Types } from "mongoose";

/**
 * This is an example of an Express API request handler. We'll tell Express to
 * run this function when our backend receives a request to retrieve a
 * particular task.
 *
 * Request handlers typically have 3 parameters: req, res, and next.
 *
 * @param req The Request object from Express. This contains all the data from
 * the API request. (https://expressjs.com/en/4x/api.html#req)
 * @param res The Response object from Express. We use this to generate the API
 * response for Express to send back. (https://expressjs.com/en/4x/api.html#res)
 * @param next The next function in the chain of middleware. If there's no more
 * processing we can do in this handler, but we're not completely done handling
 * the request, then we can pass it along by calling next(). For all of the
 * handlers defined in `src/controllers`, the next function is the global error
 * handler in `src/app.ts`.
 */
export const getTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    // if the ID isn't valid, return null
    // if the ID is valid but doesn't exist, then findById returns null
    const task = Types.ObjectId.isValid(id)
      ? await TaskModel.findById(id).populate("assignee")
      : null;

    // Set the status code (200) and body (the task object as JSON) of the response.
    // Note that you don't need to return anything, but you can still use a return
    // statement to exit the function early.
    res.status(200).json(task);
  } catch (error) {
    // pass errors to the error handler
    next(error);
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  // extract any errors that were found by the validator
  const errors = validationResult(req);
  const { title, description, isChecked, assignee } = req.body;

  try {
    // if there are errors, then this function throws an exception
    validationErrorParser(errors);

    const task = await TaskModel.create({
      title: title,
      description: description,
      isChecked: isChecked,
      dateCreated: Date.now(),
      assignee: assignee == "" ? undefined : assignee,
    });

    const createdTask = await TaskModel.findOne(task._id).populate("assignee");

    // 201 means a new resource has been created successfully
    // the newly created task is sent back to the user
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

export const removeTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await TaskModel.deleteOne({ _id: id });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateTask: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  const { id } = req.params;
  const { _id, assignee } = req.body;

  try {
    validationErrorParser(errors);

    if (id != _id) {
      res.status(400);
      return;
    }

    // make sure the assignee id is of a User object
    if (assignee) {
      const assigneeQuery = await UserModel.findById(assignee);
      if (assigneeQuery == null) {
        throw createHttpError(400, "assignee must be a User object ID");
      }
    }

    const taskQuery = Types.ObjectId.isValid(id)
      ? await TaskModel.findByIdAndUpdate(id, {
          ...req.body,
          // The findByIdAndUpdate method ignores undefined values.
          // So to remove the assignment field, we must set it to null instead of undefined.
          assignee: assignee ? assignee : null,
        })
      : null;
    if (taskQuery == null) {
      throw createHttpError(404, "Task not found.");
    }

    const updatedTask = await TaskModel.findById(id).populate("assignee");
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};
