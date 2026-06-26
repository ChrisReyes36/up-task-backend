import type { Request, Response } from "express";
import Project from "../models/Project";

export default class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    try {
      const project = new Project(req.body);
      project.manager = req.user._id;

      await project.save();

      res.status(201).send("Proyecto creado correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    const { user } = req;

    try {
      const projects = await Project.find({
        $or: [{ manager: { $in: user._id } }],
      }).populate("tasks");

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const {
      params: { id },
      user,
    } = req;

    try {
      const project = await Project.findById(id).populate("tasks");

      if (!project)
        return res.status(404).json({ error: "Proyecto no encontrado" });

      if (project.manager.toString() !== user._id.toString())
        return res.status(403).json({ error: "Acción no válida" });

      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const {
      params: { id },
      user,
    } = req;

    try {
      const project = await Project.findById(id);

      if (!project)
        return res.status(404).json({ error: "Proyecto no encontrado" });

      if (project.manager.toString() !== user._id.toString())
        return res
          .status(403)
          .json({ error: "Solo el manager puede actualizar el proyecto" });

      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;

      await project.save();

      res.status(200).send("Proyecto actualizado correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const {
      params: { id },
      user,
    } = req;

    try {
      const project = await Project.findById(id);

      if (!project)
        return res.status(404).json({ error: "Proyecto no encontrado" });

      if (project.manager.toString() !== user._id.toString())
        return res
          .status(403)
          .json({ error: "Solo el manager puede eliminar el proyecto" });

      await project.deleteOne();

      res.status(200).send("Proyecto eliminado correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };
}
