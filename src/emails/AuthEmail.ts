import environments from "../configurations/environments";
import transporter from "../configurations/nodemailer";

interface iEmail {
  email: string;
  name: string;
  token: string;
}

export default class AuthEmail {
  static sendConfirmationEmail = async (user: iEmail) => {
    await transporter.sendMail({
      from: `UpTask <${environments.MAIL_USER}>`,
      to: user.email,
      subject: "UpTask - Confirma tu cuenta",
      text: "UpTask - Confirma tu cuenta",
      html: `
        <p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi está todo listo, solo debes confirmar tu cuenta</p>
        <p>Visita el siguiente enlace:</p>
        <a href="${environments.FRONT_END_URL}/auth/confirm-account">Confirmar cuenta</a>
        <p>E ingresa el código: <b>${user.token}</b></p>
        <p>Este token expira en 10 minutos</p>
      `,
    });
  };

  static sendPasswordResetToken = async (user: iEmail) => {
    await transporter.sendMail({
      from: `UpTask <${environments.MAIL_USER}>`,
      to: user.email,
      subject: "UpTask - Restablece tu password",
      text: "UpTask - Restablece tu password",
      html: `
        <p>Hola: ${user.name}, has solicitado restablecer tu password</p>
        <p>Visita el siguiente enlace:</p>
        <a href="${environments.FRONT_END_URL}/auth/new-password">Restablecer password</a>
        <p>E ingresa el código: <b>${user.token}</b></p>
        <p>Este token expira en 10 minutos</p>
      `,
    });
  };
}
