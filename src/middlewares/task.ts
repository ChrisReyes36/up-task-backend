import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    params: { taskId },
  } = req;

  try {
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

    req.task = task;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ha ocurrido un error inesperado, inténtalo más tarde" });
  }
}

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { project, task } = req;

  if (!task.project.equals(project._id))
    return res.status(403).json({ error: "Acción no válida" });

  next();
}
