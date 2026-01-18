import { addMinutes } from "date-fns";
import { sign, verify } from "jsonwebtoken";

import { config } from "@/config/enviromentVariables";
import { DecodedToken } from "@/core/domain/types";
import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";
import { RefreshTokenGeneratorService } from "../../domain/services";

/**
 * Caso de uso para refrescar la sesión de un usuario.
 * Genera un nuevo access token y un nuevo refresh token de forma segura
 * validando la sesión activa y comparando el refresh token almacenado.
 *
 * Dependencias:
 * - refreshTokenGenerator: servicio para generar, hashear y comparar refresh tokens.
 * - authRepository: repositorio para consultar y actualizar sesiones de autenticación.
 */
export class RefreshSessionUseCase {
  constructor(
    private readonly refreshTokenGenerator: RefreshTokenGeneratorService,
    private readonly authRepository: AuthRepositoryType
  ) {}
  /**
   * Refresca la sesión emitiendo un nuevo access token y refresh token.
   *
   * Flujo:
   * 1. Valida que existan ambos tokens de entrada.
   * 2. Verifica que la sesión asociada al token anterior exista y sea válida.
   * 3. Compara el refresh token provisto con el almacenado (hash).
   * 4. Genera un nuevo access token (15 min) y un nuevo refresh token.
   * 5. Actualiza la sesión en persistencia con los nuevos valores.
   *
   * @param {string|null} refreshToken Token de actualización entregado por el cliente.
   * @param {string|null} oldSessionToken Token de sesión actual (posiblemente expirado) del cliente.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} Nuevo par de tokens.
   * @throws {AppError} Si falta el refresh token. Código: 401, tipo: ErrorMessages.REQUIRED_REFRESH.
   * @throws {AppError} Si falta el token de sesión. Código: 401, tipo: ErrorMessages.REQUIRED_TOKEN.
   * @throws {AppError} Si la sesión no existe o es inválida. Código: 401, tipo: ErrorMessages.INVALID_SESSION.
   * @throws {AppError} Si el refresh token es inválido. Código: 401, tipo: ErrorMessages.INVALID_REFRESH_TOKEN.
   */
  async run(
    refreshToken: string | null,
    oldSessionToken: string | null
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken)
      throw new AppError(
        ErrorMessages.REQUIRED_REFRESH,
        401,
        "Refresh token is required",
        true
      );

    if (!oldSessionToken)
      throw new AppError(
        ErrorMessages.REQUIRED_TOKEN,
        401,
        "Session token is required",
        true
      );

    const session = await this.authRepository.findSessionByToken(
      oldSessionToken
    );

    if (!session)
      throw new AppError(
        ErrorMessages.INVALID_SESSION,
        401,
        "Session is invalid",
        true
      );

    const isValidRefreshToken = this.refreshTokenGenerator.compare(
      refreshToken,
      session.refreshToken
    );

    if (!isValidRefreshToken)
      throw new AppError(
        ErrorMessages.INVALID_REFRESH_TOKEN,
        401,
        "Refresh token invalido",
        true
      );

    // Generamos nuevo accessToken
    const decodedOldToken = verify(session.sessionToken, config.JWT_SECRET, {
      ignoreExpiration: true,
    }) as DecodedToken;

    const newToken: string = sign(
      { userId: decodedOldToken.userId },
      config.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newExpiresAt = addMinutes(new Date(), 15);

    /** Generamos nuevo refresh token  */
    const newRefreshToken = this.refreshTokenGenerator.generate();
    const hashedNewRefreshToken =
      this.refreshTokenGenerator.hash(newRefreshToken);

    // Actualizamos la sesión
    await this.authRepository.updateSessionToken(session.sessionId, {
      refreshToken: hashedNewRefreshToken,
      sessionToken: newToken,
      expiresAt: newExpiresAt,
    });

    return { accessToken: newToken, refreshToken: newRefreshToken };
  }
}
