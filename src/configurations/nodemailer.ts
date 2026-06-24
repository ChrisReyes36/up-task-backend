import nodemailer from "nodemailer";
import environments from "./environments";

const configuration = () => ({
  host: environments.MAIL_HOST,
  port: environments.MAIL_PORT,
  secure: environments.MAIL_SECURE === "true",
  auth: {
    user: environments.MAIL_USER,
    pass: environments.MAIL_PASSWORD,
  },
});

const transporter = nodemailer.createTransport(configuration());

export default transporter;
