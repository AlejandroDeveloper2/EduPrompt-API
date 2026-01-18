import { addMinutes } from "date-fns";

import { IEmailSender } from "../../domain/ports/IEmailSender.interface";
import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";
import { VerificationCodeGeneratorService } from "../../domain/services";

export class SendAccountActivationEmailService {
  constructor(
    private readonly codeGenerator: VerificationCodeGeneratorService,
    private readonly authRepository: AuthRepositoryType,
    private readonly emailSender: IEmailSender
  ) {}

  /**
   * Envía un correo de activación de cuenta con un código de verificación.
   *
   * @param userId - Identificador único del usuario.
   * @param userEmail - Correo electrónico del usuario.
   * @throws {AppError} - Si ocurre un error al crear el código o enviar el correo.
   */
  async run(userId: string, userEmail: string): Promise<void> {
    // Generamos el código de verificación
    const verificationCode = this.codeGenerator.generate();

    // Añadimos la fecha de expiración del código
    const currentDate = new Date();
    const expiresAt = addMinutes(currentDate, 30);

    // Creamos el código de verificación
    await this.authRepository.createCode({
      code: verificationCode,
      type: "email_verification",
      userId,
      expiresAt,
    });

    //Enviamos el email de activación de cuenta
    await this.emailSender.sendEmail(
      "Activación de cuenta de EduPrompt",
      [userEmail],
      `<h1>Código de verificación: ${verificationCode}</h1>`
    );
  }
}
