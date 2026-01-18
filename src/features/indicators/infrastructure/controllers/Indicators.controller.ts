import { NextFunction, Response } from "express";

import { RequestExtended } from "@/core/infrastructure/types";

import { handleHttp } from "@/shared/utils";

import { UpdateIndicatorInput } from "../../application/dto/updateIndicators.dto";

import { IndicatorsServiceContainer } from "../containers/IndicatorsService.container";
import { SyncIndicatorsInput } from "../../application/dto/syncIndicators.dto";

const indicatorsServiceContainer = new IndicatorsServiceContainer();

/**
 * Controlador responsable de manejar las solicitudes HTTP relacionadas con los indicadores de usuario.
 *
 * Responsabilidades:
 * - Expone acciones para obtener y actualizar los indicadores del usuario autenticado.
 * - Delegar la lógica de negocio en `indicatorsServiceContainer`.
 * - Usa `handleHttp` para formatear respuestas exitosas y reenvía errores a `next`.
 *
 * Supuestos:
 * - `req.user` contiene un objeto con una propiedad `userId` (string) que identifica al usuario autenticado.
 * - `indicatorsServiceContainer` provee las operaciones `getIndicatorsByUser.run(userId)` y
 *   `updateIndicators.run(userId, updatedIndicators)`.
 *
 * @public
 */
class IndicatorsController {
  /**
   * Recupera los indicadores del usuario autenticado y los envía en la respuesta.
   *
   * El método:
   * - Lee `userId` desde `req.user`.
   * - Llama al servicio de indicadores para obtener los indicadores de ese usuario.
   * - Envía una respuesta 200 con los indicadores en caso de éxito.
   *
   * @param req - Objeto de petición extendido (se espera que incluya `user` con `userId`).
   * @param res - Objeto de respuesta de Express usado para enviar el resultado formateado.
   * @param next - Función next de Express usada para reenviar errores al manejador de errores.
   *
   * @returns Una Promise que se resuelve cuando la respuesta ha sido enviada.
   *
   * @throws Cualquier error lanzado por el servicio de indicadores; los errores se reenvían a `next`.
   */
  async getIndicators(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const indicators =
        await indicatorsServiceContainer.getIndicatorsByUser.run(userId);

      handleHttp(
        res,
        { data: indicators, message: "¡Indicadores cargados con éxito!" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Actualiza los indicadores del usuario autenticado con la carga proporcionada.
   *
   * El método:
   * - Lee `userId` desde `req.user`.
   * - Espera que `req.body` cumpla con `UpdateIndicatorInput`.
   * - Llama al servicio de indicadores para realizar la actualización.
   * - Envía una respuesta 200 confirmando la actualización en caso de éxito.
   *
   * @param req - Objeto de petición extendido (se espera que incluya `user` con `userId` y un body de tipo `UpdateIndicatorInput`).
   * @param res - Objeto de respuesta de Express usado para enviar el resultado formateado.
   * @param next - Función next de Express usada para reenviar errores al manejador de errores.
   *
   * @returns Una Promise que se resuelve cuando la respuesta ha sido enviada.
   *
   * @throws Cualquier error lanzado por el servicio de indicadores; los errores se reenvían a `next`.
   */
  async patchIndicators(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const updatedIndicators = req.body as UpdateIndicatorInput;

      await indicatorsServiceContainer.updateIndicators.run(
        userId,
        updatedIndicators
      );

      handleHttp(
        res,
        { data: null, message: "¡Indicadores actualizados con éxito!" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Maneja solicitudes HTTP PUT para sincronizar los indicadores del usuario autenticado.
   *
   * Extrae userId desde req.user (usa cadena vacía si no está presente)
   * y transforma req.body a SyncIndicatorsInput. Llama al servicio para
   * realizar la sincronización y responde con estado 200 y un mensaje de éxito
   * cuando la operación finaliza correctamente. Cualquier error se reenvía
   * al middleware de manejo de errores mediante next().
   *
   * @param req - Objeto de petición extendido que contiene:
   *              - req.user?.userId usado como propietario de la sincronización
   *              - req.body esperado como SyncIndicatorsInput
   * @param res - Objeto de respuesta de Express para enviar:
   *              200 con el mensaje "¡Indicadores actualizados y sincronizados con éxito!"
   * @param next - Función next de Express para delegar el manejo de errores
   *
   * @returns Promise<void>. La respuesta HTTP se envía directamente vía res.
   */
  async putIndicators(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const payload = req.body as SyncIndicatorsInput;

      await indicatorsServiceContainer.syncIndicators.run(userId, payload);
      handleHttp(
        res,
        {
          data: null,
          message: "¡Indicadores actualizados y sincronizados con éxito!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const indicatorsController = new IndicatorsController();
