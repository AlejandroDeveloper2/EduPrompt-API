import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Response, NextFunction } from "express";

import { config } from "@/config/enviromentVariables";
import { RequestExtended } from "@/core/infrastructure/types";
import { DecodedToken } from "@/core/domain/types";
import { AppError } from "@/core/domain/exeptions/AppError";

import { ErrorMessages } from "@/shared/utils";

/**
 * Middleware de autenticación "suave" (soft auth).
 *
 * Este middleware está diseñado para proteger endpoints específicos como el de `logout`,
 * donde es necesario identificar al usuario aunque el token JWT esté expirado.
 *
 * 🔹 Diferencia con el `authMiddleware`:
 *   - `authMiddleware` normal bloquea el acceso si el token está expirado.
 *   - `softAuthMiddleware` ignora la expiración del token (`ignoreExpiration: true`)
 *     y permite que el request avance, de modo que el sistema pueda invalidar
 *     la sesión en base de datos aunque el JWT ya no sea válido para autenticación.
 *
 * Flujo:
 * 1. Extrae el header `Authorization` y valida que comience con `Bearer`.
 * 2. Verifica el JWT con la clave secreta (`config.JWT_SECRET`), pero sin validar expiración.
 * 3. Si es válido, agrega la información del usuario decodificada (`req.user`).
 * 4. En caso de error:
 *    - `JsonWebTokenError`: Token inválido → 401 Unauthorized.
 *    - `AppError`: Se propaga el error con su mensaje y código.
 *    - Error desconocido: Responde 500 Internal Server Error.
 *
 * @param req - Objeto de la petición extendido con `user` (`RequestExtended`).
 * @param res - Objeto de la respuesta de Express.
 * @param next - Función para pasar al siguiente middleware.
 *
 * @throws {AppError} - Si no se envía el token, si el token es inválido, o en caso de error interno.
 */
export const softAuthMiddleware = (
  req: RequestExtended,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer "))
    throw new AppError(ErrorMessages.REQUIRED_TOKEN, 401, "", true);

  const token = authHeader.split(" ")[1] as string;

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      ignoreExpiration: true,
    }) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error: unknown) {
    if (error instanceof JsonWebTokenError)
      return next(
        new AppError(
          ErrorMessages.INVALID_TOKEN,
          401,
          "Session token is invalid or malformed",
          true
        )
      );
    if (error instanceof AppError)
      return next(
        new AppError(
          error.name,
          error.httpCode,
          error.message,
          error.isOperational
        )
      );
    next(
      new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `Unknown error while validating session token: ${error}`,
        false
      )
    );
  }
};
