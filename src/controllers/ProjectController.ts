import type { Request, Response } from "express";
import Project from "../models/Project";

export default class ProjectController {
  static getAllProjects = async (_req: Request, res: Response) => {
    try {
      const projects = await Project.find().populate("tasks");

      res.status(200).json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  static createProject = async (req: Request, res: Response) => {
    try {
      await Project.create(req.body);

      res.status(201).send("Proyecto creado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = req;

    try {
      const project = await Project.findById(id);

      if (!project)
        return res.status(404).json({ error: "Proyecto no encontrado" });

      res.status(200).json(project);
    } catch (error) {
      console.log(error);
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = req;

    try {
      const project = await Project.findById(id);

      if (!project)
        return res.status(404).json({ error: "Proyecto no encontrado" });

      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;

      await project.save();

      res.status(200).send("Proyecto actualizado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = req;

    try {
      const project = await Project.findById(id);

      if (!project)
        return res.status(404).json({ error: "Proyecto no encontrado" });

      await project.deleteOne();

      res.status(200).send("Proyecto eliminado correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}
