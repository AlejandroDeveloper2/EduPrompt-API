import { isAfter } from "date-fns";

import { VerificationCode } from "../../domain/entities";

export class CheckCodeExpirationService {
  /**
   * Verifica si un código de verificación ha expirado.
   *
   * @param code - Objeto de tipo {@link VerificationCode}.
   * @returns `true` si el código ha expirado, `false` en caso contrario.
   */
  run(code: VerificationCode): boolean {
    const now = new Date();
    const expirationDate = new Date(code.expiresAt);
    const isExpired = isAfter(now, expirationDate);
    return isExpired;
  }
}
