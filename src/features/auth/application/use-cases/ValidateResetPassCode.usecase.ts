import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";

import { ValidateResetPassInput } from "../dto/validateResetPassCode.dto";
import { CheckCodeExpirationService } from "../services";

export class ValidateResetPassCodeUseCase {
  private readonly checkCodeExpirationService: CheckCodeExpirationService;

  constructor(private readonly authRepository: AuthRepositoryType) {
    this.checkCodeExpirationService = new CheckCodeExpirationService();
  }

  /**
   * Valida un código de recuperación de contraseña.
   *
   * @param validateResetPassInput - Objeto con el código de verificación para reset de contraseña.
   * @returns Un objeto con el `userId` asociado al código válido.
   * @throws {AppError} - Si el código es inválido o está expirado.
   */
  async run(validateResetPassInput: ValidateResetPassInput): Promise<{
    userId: string;
  }> {
    const code = await this.authRepository.findByCode(
      validateResetPassInput.code,
      "password_reset"
    );

    if (!code)
      throw new AppError(
        ErrorMessages.INVALID_CODE,
        400,
        "Code is invalid",
        true
      );

    const isExpired = this.checkCodeExpirationService.run(code);

    if (isExpired)
      throw new AppError(ErrorMessages.EXPIRED_CODE, 403, "", true);

    const codes: number = await this.authRepository.countCodesByUser(
      code.userId,
      "password_reset"
    );

    if (codes > 0) await this.authRepository.deleteCodesByUserId(code.userId);

    return { userId: code.userId };
  }
}
