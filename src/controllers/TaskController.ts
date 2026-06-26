import type { Request, Response } from "express";
import Task from "../models/Task";

export default class TaskController {
  static createTask = async (req: Request, res: Response) => {
    const { body, project } = req;

    try {
      const task = new Task({
        ...body,
        project: project._id,
      });

      project.tasks.push(task._id);

      await Promise.allSettled([task.save(), project.save()]);

      res.status(201).send("Tarea creada correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    const { project } = req;

    try {
      const tasks = await Task.find({ project: project._id }).populate(
        "project",
      );

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    const { task } = req;

    try {
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    const { task } = req;

    try {
      task.name = req.body.name;
      task.description = req.body.description;

      await task.save();

      res.status(200).send("Tarea actualizada correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    const { project, task } = req;

    try {
      project.tasks = project.tasks.filter(
        (taskFilter) => !taskFilter._id.equals(task._id),
      );

      await Promise.allSettled([task.deleteOne(), project.save()]);

      res.status(200).send("Tarea eliminada correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static updateStatus = async (req: Request, res: Response) => {
    const {
      body: { status },
      task,
    } = req;

    try {
      task.status = status;

      await task.save();

      res.status(200).send("Tarea actualizada correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };
}
