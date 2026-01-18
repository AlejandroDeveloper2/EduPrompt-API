import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";
import { IEmailSender } from "../../domain/ports/IEmailSender.interface";
import { VerificationCodeGeneratorService } from "../../domain/services";

import { SendAccountActivationEmailService } from "../services";
import { ResendEmailVerificationCodeInput } from "../dto/resendEmailVerificationCode.dto";

import { UsersFeature } from "@/features/users";

export class ResendEmailVerificationCodeUseCase {
  private readonly sendAccountActivationEmailService: SendAccountActivationEmailService;

  constructor(
    private readonly codeGenerator: VerificationCodeGeneratorService,
    private readonly authRepository: AuthRepositoryType,
    private readonly emailSender: IEmailSender
  ) {
    this.sendAccountActivationEmailService =
      new SendAccountActivationEmailService(
        codeGenerator,
        authRepository,
        emailSender
      );
  }

  /**
   * Reenvía un nuevo código de verificación de cuenta al correo del usuario.
   *
   * - Verifica si el usuario existe mediante su email.
   * - Elimina códigos de verificación previos asociados al usuario.
   * - Envía un nuevo código de activación a su correo.
   *
   * @param resendEmailVerificationCodeInput - Objeto con el correo del usuario al que se reenviará el código.
   * @throws AppError si el usuario no existe o ocurre un error en el proceso.
   */
  async run(
    resendEmailVerificationCodeInput: ResendEmailVerificationCodeInput
  ): Promise<void> {
    const userByEmail = await UsersFeature.service.findUserByEmail.run(
      resendEmailVerificationCodeInput.email
    );

    const codes = await this.authRepository.countCodesByUser(
      userByEmail.userId,
      "email_verification"
    );

    if (codes > 0)
      await this.authRepository.deleteCodesByType(
        userByEmail.userId,
        "email_verification"
      );

    await this.sendAccountActivationEmailService.run(
      userByEmail.userId,
      resendEmailVerificationCodeInput.email
    );
  }
}
