import { Request, Response, NextFunction } from "express";

import { config } from "@/config/enviromentVariables";

import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

/**
 * Middleware de autenticación para administradores mediante **Basic Auth**.
 *
 * - Verifica que el request incluya un header `Authorization: Basic <base64>`.
 * - Decodifica las credenciales en formato `username:password`.
 * - Compara contra las credenciales configuradas en las variables de entorno (`ADMIN_USER`, `ADMIN_PASSWORD`).
 * - Si las credenciales son correctas, permite continuar al siguiente middleware/controlador.
 * - Si faltan o son inválidas, lanza un error `401 Unauthorized`.
 *
 * ### Casos de error
 * - `401` si no se envía el header de autorización o no tiene el formato correcto.
 * - `401` si las credenciales no coinciden con las configuradas.
 *
 * @param req - Objeto `Request` de Express.
 * @param res - Objeto `Response` de Express.
 * @param next - Función para continuar con el siguiente middleware o manejar errores.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { adminAuthMiddleware } from "@/middlewares/adminAuth.middleware";
 * import { apiKeyController } from "@/controllers/apiKey.controller";
 *
 * const router = express.Router();
 *
 * // Ruta protegida: solo admins pueden crear API keys
 * router.post("/api-keys", adminAuthMiddleware, apiKeyController.postCreateKey);
 * ```
 */
export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return next(
        new AppError(
          ErrorMessages.MISSING_ADMIN_AUTH_HEADERS,
          401,
          "Missing admin credentials at headers",
          true
        )
      );
    }

    // Extraemos el base64 después de "Basic "
    const base64Credentials = authHeader.split(" ")[1] as string;
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");

    // Validamos contra credenciales de entorno
    if (username === config.ADMIN_USER && password === config.ADMIN_PASSWORD) {
      return next();
    }

    return next(
      new AppError(
        ErrorMessages.UNAUTHORIZED,
        401,
        "don't have authorization to access to the resource",
        true
      )
    );
  } catch (err) {
    next(err);
  }
};
