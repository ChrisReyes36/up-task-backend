import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
  noteId: Types.ObjectId;
};

export default class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const {
      body: { content },
      task,
      user,
    } = req;

    const note = new Note({ content, createdBy: user._id, task: task._id });
    task.notes.push(note._id);

    try {
      await Promise.allSettled([note.save(), task.save()]);
      res.status(201).send("Nota Creada Correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static getTaskNotes = async (req: Request, res: Response) => {
    const { task } = req;

    try {
      const notes = await Note.find({ task: task._id });
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static deleteNote = async (req: Request<NoteParams>, res: Response) => {
    const {
      params: { noteId },
      task,
      user,
    } = req;

    const note = await Note.findById(noteId);

    if (!note) return res.status(404).json({ error: "Nota no encontrada" });

    if (note.createdBy.toString() !== user._id.toString())
      return res.status(403).json({ error: "Acción no válida" });

    task.notes = task.notes.filter(
      (note) => note.toString() !== noteId.toString(),
    );

    try {
      await Promise.allSettled([note.deleteOne(), task.save()]);
      res.status(200).send("Nota Eliminada Correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };
}
