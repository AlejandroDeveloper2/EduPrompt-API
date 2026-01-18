import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";

import { ValidateCodeAndUpdateEmailInput } from "../dto/validateCodeAndUpdateEmail.dto";
import { CheckCodeExpirationService } from "../services";

import { UsersFeature } from "@/features/users";

export class ValidateCodeAndUpdateEmailUseCase {
  private readonly checkCodeExpirationService: CheckCodeExpirationService;

  constructor(private readonly authRepository: AuthRepositoryType) {
    this.checkCodeExpirationService = new CheckCodeExpirationService();
  }
  /**
   * Valida el código de verificación enviado al nuevo correo y actualiza el correo electrónico del usuario si dicho código es valido
   *
   * @param userId - Id del usuario que desea actualizar su dirección de correo eléctronico.
   * @param validateCodeAndUpdateEmailInput - Objeto con el código de verificación a validar ingresado por el usuario y la nueva dirección de correo eletrónico a actualizar.
   * @throws {AppError} - Si el usuario no existe o el código de verificación es invalido o ha expirado.
   */
  async run(
    userId: string,
    validateCodeAndUpdateEmailInput: ValidateCodeAndUpdateEmailInput
  ): Promise<void> {
    const { code, updatedEmail } = validateCodeAndUpdateEmailInput;

    const resetEmailcode = await this.authRepository.findByCode(
      code,
      "email_reset"
    );

    if (!resetEmailcode)
      throw new AppError(
        ErrorMessages.INVALID_CODE,
        400,
        "Verification code is invalid",
        true
      );

    const isExpired = this.checkCodeExpirationService.run(resetEmailcode);

    if (isExpired)
      throw new AppError(
        ErrorMessages.EXPIRED_CODE,
        403,
        "Verification code has expired",
        true
      );

    const codes: number = await this.authRepository.countCodesByUser(
      userId,
      "email_reset"
    );

    if (codes > 0) await this.authRepository.deleteCodesByUserId(userId);

    await UsersFeature.service.editUserEmail.run(userId, updatedEmail);
  }
}
