import { addMinutes } from "date-fns";

import { IEmailSender } from "../../domain/ports/IEmailSender.interface";
import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";
import { VerificationCodeGeneratorService } from "../../domain/services";

import { SendEmailChangeRequestInput } from "../dto/sendEmailChangeRequest.dto";

import { UsersFeature } from "@/features/users";

export class SendEmailChangeRequestUseCase {
  constructor(
    private readonly codeGenerator: VerificationCodeGeneratorService,
    private readonly authRepository: AuthRepositoryType,
    private readonly emailSender: IEmailSender
  ) {}
  /**
   * Envia un correo electrónico de con un código de verificación al nuevo correo ingresado.
   *
   * @param userId - Id del usuario que desea actualizar su dirección de correo eléctronico.
   * @param sendEmailChangeRequestInput - Objeto con la nueva dirección de correo electrónico a actualizar.
   * @returns Objeto con el nuevo correo actualizado del usuario
   * @throws {AppError} - Si el usuario no existe o el nuevo correo ya esta siendo usado por otro usuario.
   */
  async run(
    userId: string,
    sendEmailChangeRequestInput: SendEmailChangeRequestInput
  ): Promise<{
    updatedEmail: string;
  }> {
    //Validamos si el userId pertenece a un usuario existente
    await UsersFeature.service.findUserProfile.run(userId);

    await UsersFeature.service.validateUserEmailAvailability.run(
      sendEmailChangeRequestInput.updatedEmail,
      userId
    );

    // Generamos el código de reset de correo electrónico
    const resetEmailCode = this.codeGenerator.generate();

    // Añadimos la fecha de expiración del código
    const currentDate = new Date();
    const expiresAt = addMinutes(currentDate, 30);

    // Creamos el código de reset de correo eléctronico
    await this.authRepository.createCode({
      code: resetEmailCode,
      type: "email_reset",
      userId,
      expiresAt,
    });

    //Enviamos el email de cambio de contraseña
    await this.emailSender.sendEmail(
      "Solicitud de cambio de correo electrónico de EduPrompt",
      [sendEmailChangeRequestInput.updatedEmail],
      `<h1>Código de verificación: ${resetEmailCode}</h1>`
    );

    return { updatedEmail: sendEmailChangeRequestInput.updatedEmail };
  }
}
