import { transporter } from "@/config/emailConfig";

import { IEmailSender } from "../../domain/ports/IEmailSender.interface";

import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

export class NodeMailerAdapter implements IEmailSender {
  /**
   * Envía un correo electrónico con el asunto y plantilla HTML especificados a uno o más destinatarios.
   *
   * @param subject - El asunto del correo electrónico.
   * @param receivers - Un arreglo de direcciones de correo electrónico a las que se enviará el correo.
   * @param htmlTemplate - El contenido HTML que se usará como cuerpo del correo electrónico.
   * @returns Una promesa que se resuelve cuando el correo ha sido enviado.
   * @throws {AppError} Lanza un error si el correo no pudo ser enviado.
   */
  async sendEmail(
    subject: string,
    receivers: string[],
    htmlTemplate: string
  ): Promise<void> {
    try {
      const receiverEmails: string = receivers.join(", ");
      await transporter.sendMail({
        from: '"EduPrompt App" <diegodiazdev9817@gmail.com>',
        to: receiverEmails,
        subject,
        html: htmlTemplate,
      });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.EMAIL_SENDING_ERROR,
        500,
        `An error ocurred while sending the email: ${error}`,
        false
      );
    }
  }
}
