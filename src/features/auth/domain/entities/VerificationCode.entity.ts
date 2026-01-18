import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { VerificationCodeType } from "../types";

/**
 * Entidad de dominio que representa un código de verificación asociado a un usuario.
 * Gestiona la validación de longitud del código (4 dígitos).
 */
export class VerificationCode {
  /**
   * Crea una instancia de VerificationCode.
   *
   * Valida que el código tenga exactamente 4 caracteres.
   *
   * @param codeId Identificador único del código.
   * @param code Código de verificación de 4 dígitos.
   * @param type Tipo de código de verificación.
   * @param userId Identificador del usuario propietario del código.
   * @param expiresAt Fecha y hora de expiración del código.
   * @throws {AppError} Si el código no tiene exactamente 4 dígitos.
   */
  constructor(
    public readonly codeId: string,
    public code: string,
    public type: VerificationCodeType,
    public readonly userId: string,
    public expiresAt: Date
  ) {
    if (code.length !== 4)
      throw new AppError(
        ErrorMessages.INVALID_CODE,
        400,
        "El codigo debe tener 4 digitos",
        true
      );
  }
}
