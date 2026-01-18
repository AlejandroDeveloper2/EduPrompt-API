import { Request, Response, NextFunction } from "express";

import { handleHttp } from "@/shared/utils";

import { CreateApiKeyInput } from "../../application/dto/apiKey.dto";

import { ApiKeyServiceContainer } from "../containers/ApiKeyService.container";

const apiKeyServiceContainer = new ApiKeyServiceContainer();

/**
 * Controlador para la gestión de API Keys.
 *
 * Expone endpoints para crear y administrar claves de acceso.
 * Este controlador asume que las rutas están protegidas por middlewares
 * de autorización (por ejemplo, solo accesibles por administradores).
 */

class ApiKeyController {
  /**
   * Crea una nueva API Key.
   *
   * - Solo puede ser ejecutado por usuarios con rol de administrador.
   * - Recibe los datos de la API Key desde el cuerpo de la request (`req.body`).
   * - Llama al servicio para generar un nuevo `keyId` y `secret`.
   * - Retorna el token completo (`keyId.secret`) **una sola vez** junto con el `keyId`.
   *
   * @param req - Objeto de la request de Express, que debe contener un `CreateApiKeyInput` en el body.
   * @param res - Objeto de la response de Express, usado para enviar la respuesta al cliente.
   * @param next - Función de middleware para pasar errores al manejador global.
   *
   * @returns Retorna un `201 Created` con el token y el `keyId`.
   *
   * @example
   * ```json
   * POST /api_keys/create
   * {
   *   "name": "Mi integración",
   *   "scopes": ["READ_USERS", "WRITE_USERS"],
   *   "expiresAt": "2025-12-31T23:59:59.000Z"
   * }
   *
   * Response 201:
   * {
   *   "message": "API key created successfully",
   *   "data": {
   *     "token": "ak_live_ab12cd34ef5678.secretXYZ",
   *     "keyId": "ak_live_ab12cd34ef5678"
   *   }
   * }
   * ```
   */
  async postCreateKey(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input = req.body as CreateApiKeyInput;

      const { token, keyId } = await apiKeyServiceContainer.createApiKey.run(
        input
      );

      handleHttp(
        res,
        { data: { token, keyId }, message: "API key created successfully" },
        201
      );
    } catch (err) {
      next(err);
    }
  }
}
export const apiKeyController = new ApiKeyController();
