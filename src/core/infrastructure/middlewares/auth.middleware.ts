import { NextFunction, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { RequestExtended } from "@/core/infrastructure/types";

import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { AuthFeature } from "@/features/auth";

/**
 * Middleware que valida tokens JWT del encabezado de Autorización.
 *
 * Extrae el token bearer del encabezado de solicitud, lo valida usando AuthService,
 * y adjunta los datos del token decodificado al objeto de solicitud para manejadores posteriores.
 *
 * @param req - El objeto de solicitud extendido que recibirá los datos del usuario decodificados
 * @param res - El objeto de respuesta
 * @param next - La función del siguiente middleware para pasar el control
 *
 * @throws {AppError} Con estado 401 si el token ha expirado
 * @throws {AppError} Con estado 401 si el token es inválido o tiene formato incorrecto
 * @throws {Error} Cualquier otro error de validación de token se pasa al siguiente middleware
 *
 * @remarks
 * - Espera encabezado de Autorización en formato: "Bearer <token>"
 * - El servicio AuthFeature se importa dinámicamente en el primer uso
 * - Establece req.user con la carga útil del token decodificado en validación exitosa
 *
 * @example
 * app.use(authMiddleware);
 */
export const authMiddleware = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let authService: (typeof AuthFeature)["service"] | null = null;

  if (!authService) {
    const { AuthFeature } = await import("@/features/auth");
    authService = AuthFeature.service;
  }

  try {
    const tokenByUser: string | null = req.headers.authorization || null;

    const token: string | undefined = tokenByUser
      ? tokenByUser.split(" ").pop()
      : undefined;

    const decodedToken = await authService.validateSession.run(token);
    req.user = decodedToken;
    next();
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError)
      return next(
        new AppError(ErrorMessages.EXPIRED_TOKEN, 401, "Token expirado", true)
      );
    if (error instanceof JsonWebTokenError)
      return next(
        new AppError(
          ErrorMessages.INVALID_TOKEN,
          401,
          "Token inválido o malformado",
          true
        )
      );
    next(error);
  }
};
