import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepositoryType) {}
  /**
   * Cierra sesión invalidando el token en la base de datos.
   *
   * @param sessionToken - Token de sesión que se desea invalidar.
   * @throws {AppError} - Si la sesión no existe.
   */
  async run(sessionToken: string): Promise<void> {
    const session = await this.authRepository.findSessionByToken(sessionToken);

    if (!session)
      throw new AppError(
        ErrorMessages.INVALID_SESSION,
        401,
        "Session is invalid",
        true
      );

    await this.authRepository.invalidateSession(session.sessionId);
  }
}
