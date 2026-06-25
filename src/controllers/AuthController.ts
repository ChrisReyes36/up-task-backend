import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import AuthEmail from "../emails/AuthEmail";

export default class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const {
        body: { password, email },
      } = req;

      const userExists = await User.findOne({ email });

      if (userExists)
        return res.status(409).json({ error: "El usuario ya está registrado" });

      const user = new User(req.body);

      user.password = await hashPassword(password);

      const token = new Token({
        token: generateToken(),
        user: user.id,
      });

      await AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.status(201).send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const {
        body: { token },
      } = req;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists)
        return res.status(404).json({ error: "Token no válido" });

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.status(200).send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const {
        body: { email, password },
      } = req;
      const user = await User.findOne({ email });

      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });

      if (!user.confirmed) {
        const token = new Token({
          user: user.id,
          token: generateToken(),
        });

        await Promise.allSettled([
          token.save(),
          AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token,
          }),
        ]);

        return res.status(401).json({
          error:
            "La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación",
        });
      }

      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect)
        return res.status(401).json({
          error: "Password incorrecto",
        });

      res.status(200).send("Autenticado...");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const {
        body: { email },
      } = req;

      const user = await User.findOne({ email });

      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });

      if (user.confirmed)
        return res.status(409).json({ error: "El usuario ya está confirmado" });

      const token = new Token({
        token: generateToken(),
        user: user.id,
      });

      await AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.status(200).send("Se envió un nuevo token a tu e-mail");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
