import { verify } from "jsonwebtoken";

import { DecodedToken } from "@/core/domain/types";
import { config } from "@/config/enviromentVariables";
import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";

export class ValidateSessionUseCase {
  constructor(private readonly authRepository: AuthRepositoryType) {}

  /**
   * Valida un token de sesión JWT.
   *
   * @param sessionToken - Token de sesión recibido en la petición.
   * @returns El payload decodificado del token.
   * @throws {AppError} - Si el token está ausente, es inválido, ha expirado o la sesión no existe.
   */
  async run(sessionToken: string | undefined): Promise<DecodedToken> {
    if (!sessionToken)
      throw new AppError(
        ErrorMessages.REQUIRED_TOKEN,
        401,
        "Session token is required",
        true
      );

    const decodedToken = verify(
      sessionToken,
      <string>config.JWT_SECRET
    ) as DecodedToken;

    const session = await this.authRepository.findSessionByToken(sessionToken);

    if (!session)
      throw new AppError(
        ErrorMessages.INVALID_SESSION,
        401,
        "Session is invalid",
        true
      );

    return decodedToken;
  }
}
