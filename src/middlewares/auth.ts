import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import environments from "../configurations/environments";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers.authorization;

  if (!bearer) return res.status(401).json({ error: "No Autorizado" });

  const [, token] = bearer.split(" ");

  try {
    const decoded = jwt.verify(token, environments.JWT_SECRET);

    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id).select("_id name email");

      if (user) {
        req.user = user;
      } else {
        res.status(500).json("Token No Válido");
      }
    }
  } catch (error) {
    res.status(500).json("Token No Válido");
  }

  next();
};
