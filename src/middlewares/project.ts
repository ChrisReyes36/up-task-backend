import type { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";

declare global {
  namespace Express {
    interface Request {
      project: IProject;
    }
  }
}

export async function projectExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    params: { projectId },
  } = req;

  try {
    const project = await Project.findById(projectId);

    if (!project)
      return res.status(404).json({ error: "Proyecto no encontrado" });

    req.project = project;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ha ocurrido un error inesperado, inténtalo más tarde" });
  }
}
