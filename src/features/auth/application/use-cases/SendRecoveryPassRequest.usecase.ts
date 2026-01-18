import { addMinutes } from "date-fns";

import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";
import { IEmailSender } from "../../domain/ports/IEmailSender.interface";
import { VerificationCodeGeneratorService } from "../../domain/services";

import { RecoveryPasswordRequestInput } from "../dto/sendRecoveryPassRequest.dto";

import { UsersFeature } from "@/features/users";

export class SendRecoveryPassRequestUseCase {
  constructor(
    private readonly codeGenerator: VerificationCodeGeneratorService,
    private readonly authRepository: AuthRepositoryType,
    private readonly emailSender: IEmailSender
  ) {}

  /**
   * Envía un correo de recuperación de contraseña con un código de verificación.
   *
   * @param recoveryPasswordRequestInput - Objeto con el Correo electrónico del usuario que solicita el cambio.
   * @throws {AppError} - Si no existe un usuario con el email proporcionado.
   */
  async run(
    recoveryPasswordRequestInput: RecoveryPasswordRequestInput
  ): Promise<void> {
    //Validamos que exista el usuario
    const userByEmail = await UsersFeature.service.findUserByEmail.run(
      recoveryPasswordRequestInput.email
    );

    // Generamos el código de reset de contraseña
    const resetCode = this.codeGenerator.generate();

    // Añadimos la fecha de expiración del código
    const currentDate = new Date();
    const expiresAt = addMinutes(currentDate, 30);

    // Creamos el código de reset de contraseña
    await this.authRepository.createCode({
      code: resetCode,
      type: "password_reset",
      userId: userByEmail.userId,
      expiresAt,
    });

    //Enviamos el email de cambio de contraseña
    await this.emailSender.sendEmail(
      "Solicitud de cambio de contraseña de EduPrompt",
      [userByEmail.email],
      `<h1>Código de verificación: ${resetCode}</h1>`
    );
  }
}
