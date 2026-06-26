import type { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export default class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const {
      body: { email },
    } = req;

    const user = await User.findOne({ email }).select("_id email name");

    if (!user) return res.status(404).json({ error: "Usuario No Encontrado" });

    res.status(200).json(user);
  };

  static addMemberById = async (req: Request, res: Response) => {
    const {
      body: { id },
      project,
    } = req;

    const user = await User.findById(id).select("_id email name");

    if (!user) return res.status(404).json({ error: "Usuario No Encontrado" });

    if (project.team.includes(user._id))
      return res
        .status(409)
        .json({ error: "El usuario ya existe en el proyecto" });

    project.team.push(user._id);
    await project.save();

    res.status(200).send("Usuario agregado correctamente");
  };

  static removeMemberById = async (req: Request, res: Response) => {
    const {
      params: { userId },
      project,
    } = req;

    if (!project.team.some((teamMember) => teamMember.toString() === userId))
      return res
        .status(409)
        .json({ error: "El usuario no existe en el proyecto" });

    project.team = project.team.filter(
      (teamMember) => teamMember.toString() !== userId,
    );

    await project.save();

    res.status(200).send("Usuario eliminado correctamente");
  };

  static getProjectTeam = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project._id).populate({
      path: "team",
      select: "_id email name",
    });

    res.status(200).json(project.team);
  };
}
