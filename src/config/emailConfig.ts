import nodemailer from "nodemailer";

import { config } from "./enviromentVariables";

/** Configuración para nodemailer */
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.NODE_MAILER_USER,
    pass: config.NODE_MAILER_PASSWORD,
  },
});
