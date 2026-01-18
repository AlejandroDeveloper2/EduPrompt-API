import { NextFunction, Request, Response } from "express";

import { ApiKeyScope } from "@/features/api-keys/domain/types";

import { ApiKeysFeature } from "@/features/api-keys";

import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

declare module "express-serve-static-core" {
  interface Request {
    apiKey?: { keyId: string; scopes: string[] };
  }
}

/**
 * Parsea y valida el header que contiene la API Key.
 *
 * Permite dos formatos:
 * - `x-api-key: <keyId.secret>`
 * - `Authorization: ApiKey <keyId.secret>`
 *
 * @param raw - Header sin procesar (`x-api-key` o `authorization`).
 * @returns Un objeto con `keyId` y `secret` si es válido, de lo contrario `null`.
 */
function parseHeader(
  raw?: string | null
): { keyId: string; secret: string } | null {
  if (!raw) return null;
  // Permite "x-api-key: <token>" o "Authorization: ApiKey <token>"
  const token = (raw.startsWith("ApiKey ") ? raw.split(" ")[1] : raw) as string;

  const [keyId, secret] = token.split(".");

  if (!keyId || !secret) return null;

  return { keyId, secret };
}

/**
 * Middleware guard que valida API Keys contra la base de datos.
 *
 * ### Funcionalidad:
 * - Extrae el API Key desde `x-api-key` o `Authorization: ApiKey`.
 * - Verifica que el API Key exista en la base de datos, esté activo y no esté expirado.
 * - Valida el `secret` asociado al `keyId`.
 * - Revisa que el API Key tenga los *scopes* necesarios para acceder al recurso.
 * - Adjunta la información del API Key a `req.apiKey` para uso downstream.
 * - Marca la última fecha de uso del API Key (sin bloquear la request en caso de error).
 *
 * ### Casos de error:
 * - 401 si falta la API Key, es inválida, el secret no coincide o está expirada.
 * - 403 si la API Key está inactiva o no posee los *scopes* requeridos.
 * - 500 en caso de error inesperado durante la validación.
 *
 * @param scopes - Lista de *scopes* requeridos para acceder al recurso.
 * @returns Middleware de Express que valida la API Key y continúa con la request.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { apiKeyGuard } from "@/middlewares/apiKeyGuard";
 * import { ApiKeyScope } from "@/entities";
 *
 * const router = express.Router();
 *
 * // Ruta protegida que requiere el scope "READ_USERS"
 * router.get("/users", apiKeyGuard([ApiKeyScope.READ_USERS]), (req, res) => {
 *   res.json({ message: "Usuarios obtenidos correctamente" });
 * });
 * ```
 */
export const apiKeyGuard = (scopes: ApiKeyScope[] = []) => {
  let apiKeyRepository: (typeof ApiKeysFeature)["repository"] | null = null;
  let apiKeyService: (typeof ApiKeysFeature)["service"] | null = null;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!apiKeyService) {
      const { ApiKeysFeature } = await import("@/features/api-keys");
      apiKeyService = ApiKeysFeature.service;
    }

    try {
      if (!apiKeyRepository) {
        // import dinámico, evita el ciclo
        const { ApiKeysFeature } = await import("@/features/api-keys");
        apiKeyRepository = ApiKeysFeature.repository;
      }
      // extraemos el apikey de los headers
      const rawHeader = req.header("x-api-key") ?? req.header("authorization");

      // Transformamos el apikey
      const parsed = parseHeader(rawHeader);

      if (!parsed)
        return next(
          new AppError(
            ErrorMessages.MISSING_API_KEY,
            401,
            "Api key is missing",
            true
          )
        );

      const { keyId, secret } = parsed;

      // Validamos que el api key este almacenado en nuestra base de datos
      const apiKey = await apiKeyRepository.findById(keyId);

      if (!apiKey)
        return next(
          new AppError(
            ErrorMessages.INVALID_API_KEY,
            401,
            "Api key is not valid",
            true
          )
        );

      // Validamos que el api key este activa
      if (!apiKey.active)
        return next(
          new AppError(
            ErrorMessages.INACTIVE_API_KEY,
            403,
            "Api key is not active",
            true
          )
        );

      //Validamos que el api key no este expirada
      if (apiKey.expiresAt && apiKey.expiresAt < new Date())
        return next(
          new AppError(
            ErrorMessages.EXPIRED_API_KEY,
            401,
            "Api key has expired",
            true
          )
        );

      //Validamos el secret
      const ok = await apiKeyService.verifySecret.run(keyId, secret);

      if (!ok)
        return next(
          new AppError(
            ErrorMessages.INVALID_API_KEY,
            401,
            "Api key is not valid or has not a valid secret hash",
            true
          )
        );

      // Validamos los permisos
      const missing = scopes.filter((s) => !apiKey.scopes.includes(s));
      if (missing.length > 0)
        return next(
          new AppError(
            ErrorMessages.INSUFFICIENT_SCOPES,
            403,
            "Api key has not enough scopes",
            true
          )
        );

      // Attach para logging o reglas downstream
      req.apiKey = { keyId: apiKey.keyId, scopes: apiKey.scopes };

      // Marcar last used (no bloquear request en caso de error)
      apiKeyRepository.setLastUsed(apiKey.keyId, new Date());

      return next();
    } catch (error: unknown) {
      console.log(apiKeyService);
      next(
        new AppError(
          ErrorMessages.API_KEY_VALIDATION_ERROR,
          500,
          `Unknown error while validating api key: ${error}`,
          false
        )
      );
    }
  };
};
