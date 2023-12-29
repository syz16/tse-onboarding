import { RequestHandler } from "express";
import TaskModel from "src/models/task";

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    console.log("here 1");
    const tasks = await TaskModel.find({}).sort("-dateCreated");
    res.status(200).json(tasks);
  } catch (error) {
    console.log("here 2");
    next(error);
  }
};
