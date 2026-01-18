import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";

import { ValidateEmailVerificationInput } from "../dto/validateEmailVerificationCode.dto";
import { CheckCodeExpirationService } from "../services";

import { UsersFeature } from "@/features/users";

export class ValidateEmailVerificationCodeUseCase {
  private readonly checkCodeExpirationService: CheckCodeExpirationService;

  constructor(private readonly authRepository: AuthRepositoryType) {
    this.checkCodeExpirationService = new CheckCodeExpirationService();
  }

  /**
   * Valida un código de verificación de activación de cuenta.
   *
   * @param validateEmailVerificationInput - Objeto con el código de verificación recibido por correo.
   * @throws {AppError} - Si el código es inválido, está expirado o ya fue usado.
   */
  async run(
    validateEmailVerificationInput: ValidateEmailVerificationInput
  ): Promise<void> {
    const code = await this.authRepository.findByCode(
      validateEmailVerificationInput.code,
      "email_verification"
    );

    if (!code)
      throw new AppError(
        ErrorMessages.INVALID_CODE,
        400,
        "Verification code is invalid",
        true
      );

    const isExpired = this.checkCodeExpirationService.run(code);

    if (isExpired)
      throw new AppError(
        ErrorMessages.EXPIRED_CODE,
        403,
        "Verification code has expired",
        true
      );

    await UsersFeature.service.editUserAccountStatus.run(code.userId, "active");

    const codes: number = await this.authRepository.countCodesByUser(
      code.userId,
      "email_verification"
    );

    if (codes > 0) await this.authRepository.deleteCodesByUserId(code.userId);
  }
}
