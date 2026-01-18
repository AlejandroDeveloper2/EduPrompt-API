import { Response, Request, NextFunction } from "express";

import { RequestExtended } from "@/core/infrastructure/types";

import { handleHttp } from "@/shared/utils";

import { toPromptOutputDto } from "../../application/mappers";
import { CreatePromptInput } from "../../application/dto/createPrompt.dto";
import { PromptsFiltersInput } from "../../application/dto/findPromptsByUser.dto";
import { UpdatePromptInput } from "../../application/dto/updatePrompt.dto";
import { DeletePromptsByIdInput } from "../../application/dto/deleteManyPrompts.dto";

import { PromptsServiceContainer } from "../containers/PromptsService.container";
import { SyncPromptsInput } from "../../application/dto/syncPrompts.dto";

const promptsServiceContainer = new PromptsServiceContainer();

/**
 * Controller encargado de manejar las operaciones relacionadas con prompts.
 *
 * Se encarga de recibir las solicitudes HTTP, validarlas y delegar la lógica de negocio
 * al servicio `PromptService`. Retorna las respuestas en un formato unificado.
 */
class PromptController {
  /**
   * Crea un nuevo prompt.
   *
   * @route POST /prompts
   * @param {Request} req - Objeto de solicitud con `userId` y los datos del prompt en el body.
   * @param {Response} res - Objeto de respuesta para enviar el resultado.
   * @param {NextFunction} next - Función para pasar errores al middleware global.
   * @returns {Promise<void>} Envía un 201 si el prompt fue creado exitosamente.
   */
  async postPrompt(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const promptInput = req.body as CreatePromptInput;

      await promptsServiceContainer.createPrompt.run(userId, promptInput);

      handleHttp(
        res,
        { data: null, message: "Prompt created successfully!" },
        201
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Obtiene todos los prompts de un usuario autenticado, con filtros opcionales.
   *
   * @route GET /prompts
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y filtros de query.
   * @param {Response} res - Objeto de respuesta con los prompts paginados.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 con los recursos encontrados.
   */
  async getPromptsByUser(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const query = req.query as PromptsFiltersInput;

      const paginatedPrompts =
        await promptsServiceContainer.findPromptsByUser.run(userId, query);

      handleHttp(
        res,
        {
          data: {
            ...paginatedPrompts,
            records: paginatedPrompts.records.map((r) => toPromptOutputDto(r)),
          },
          message: "Prompts loaded successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Obtiene un prompt por su ID.
   *
   * @route GET /prompts/:promptId
   * @param {Request} req - Objeto de solicitud con `promptId` en los parámetros de ruta.
   * @param {Response} res - Objeto de respuesta con el prompt encontrado.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 con el prompt encontrado.
   */
  async getPromptById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { promptId } = req.params;

      const prompt = await promptsServiceContainer.findPromptById.run(
        promptId as string
      );

      handleHttp(
        res,
        {
          data: toPromptOutputDto(prompt),
          message: "Prompt loaded successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Actualiza los datos del prompt.
   *
   * @route PUT /prompts/:promptId
   * @param {RequestExtended} req - Objeto de solicitud con `promptId`, `userId` y los nuevos datos.
   * @param {Response} res - Objeto de respuesta.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 si la actualización fue exitosa.
   */
  async putPrompt(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { promptId } = req.params;
      const { userId } = req.user ?? { userId: "" };
      const updatedPromptInput = req.body as UpdatePromptInput;

      await promptsServiceContainer.editPrompt.run(
        userId,
        promptId as string,
        updatedPromptInput
      );

      handleHttp(
        res,
        {
          data: null,
          message: "Prompt updated successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Elimina múltiples prompts de un usuario.
   *
   * @route DELETE /prompts
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y un arreglo de IDs de prompts.
   * @param {Response} res - Objeto de respuesta.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 si los prompts fueron eliminados exitosamente.
   */
  async deleteManyPrompts(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const payload = req.body as DeletePromptsByIdInput;

      await promptsServiceContainer.deleteManyPrompts.run(userId, payload);

      handleHttp(
        res,
        {
          data: null,
          message: "Prompts deleted successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Sincroniza los prompts de un usuario.
   *
   * @route POST /prompts/sync
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y un arreglo de prompts a sincronizar.
   * @param {Response} res - Objeto de respuesta.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 si los prompts fueron sincronizados exitosamente.
   */
  async postSyncPrompts(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const syncPromptsInput = req.body as SyncPromptsInput;

      await promptsServiceContainer.syncPrompts.run(userId, syncPromptsInput);

      handleHttp(
        res,
        {
          data: null,
          message: "Prompts synced successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const promptController = new PromptController();
