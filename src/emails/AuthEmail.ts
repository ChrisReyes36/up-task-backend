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
        <a href="">Confirmar cuenta</a>
        <p>E ingresa el código: <b>${user.token}</b></p>
        <p>Este token expira en 10 minutos</p>
      `,
    });
  };
}
