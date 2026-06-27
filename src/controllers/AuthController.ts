import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import AuthEmail from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

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
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
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
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
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

      const token = generateJWT({ id: user._id });

      res.status(200).send(token);
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const {
        body: { email },
      } = req;

      const user = await User.findOne({ email });

      if (!user)
        return res.status(404).json({ error: "El usuario no está registrado" });

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
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const {
        body: { email },
      } = req;

      const user = await User.findOne({ email });

      if (!user)
        return res.status(404).json({ error: "El usuario no está registrado" });

      const token = new Token({
        token: generateToken(),
        user: user.id,
      });

      await token.save();

      await AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.status(200).send("Revisa tu email para instrucciones");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const {
        body: { token },
      } = req;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists)
        return res.status(404).json({ error: "Token no válido" });

      res.status(200).send("Token válido, define tu nuevo password");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const {
        params: { token },
        body: { password },
      } = req;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists)
        return res.status(404).json({ error: "Token no válido" });

      const user = await User.findById(tokenExists.user);
      user.password = await hashPassword(password);

      Promise.allSettled([tokenExists.deleteOne(), user.save()]);

      res.status(200).send("El password se modificó correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static user = async (req: Request, res: Response) => {
    res.status(200).json(req.user);
  };

  static updateProfile = async (req: Request, res: Response) => {
    const {
      body: { name, email },
      user,
    } = req;

    const userExists = await User.findOne({ email });

    if (userExists && userExists._id.toString() !== user._id.toString())
      return res.status(409).json({ error: "El email ya está registrado" });

    user.name = name;
    user.email = email;

    try {
      await user.save();
      res.status(200).send("Perfil actualizado correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };

  static updateCurrentPassword = async (req: Request, res: Response) => {
    const {
      body: { current_password: currentPassword, password },
    } = req;

    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await checkPassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordCorrect)
      return res
        .status(401)
        .json({ error: "El password actual es incorrecto" });

    user.password = await hashPassword(password);

    try {
      await user.save();
      res.status(200).send("El password se modificó correctamente");
    } catch (error) {
      res.status(500).json({
        error: "Ha ocurrido un error inesperado, inténtalo más tarde",
      });
    }
  };
}
