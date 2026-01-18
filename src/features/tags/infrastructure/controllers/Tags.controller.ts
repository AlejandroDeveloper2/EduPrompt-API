import { Response, NextFunction, Request } from "express";

import { CreateTagInput } from "../../application/dto/createTag.dto";
import { TagFiltersInput } from "../../application/dto/findTags.dto";
import { toTagOutputDto } from "../../application/mappers";
import { UpdateTagInput } from "../../application/dto/updateTag.dto";

import { RequestExtended } from "@/core/infrastructure/types";

import { handleHttp } from "@/shared/utils";

import { TagServiceContainer } from "../containers/TagService.container";
import { SyncTagsInput } from "../../application/dto/syncTags.dto";
import { DeleteManyTagsInput } from "../../application/dto/deleteManyTags.dto";

const tagsServiceContainer = new TagServiceContainer();

/**
 * Controlador para gestionar operaciones de etiquetas.
 * Maneja solicitudes HTTP para crear, recuperar, actualizar y eliminar etiquetas.
 *
 * @class TagsController
 *
 */
class TagsController {
  /**
   * @method postTag - Crea una nueva etiqueta para el usuario autenticado
   * @param {RequestExtended} req - Objeto de solicitud extendido que contiene información del usuario
   * @param {Response} res - Objeto de respuesta de Express
   * @param {NextFunction} next - Función de middleware siguiente de Express
   * @returns {Promise<void>} */
  async postTag(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const tagInput = req.body as CreateTagInput;

      await tagsServiceContainer.createTag.run(userId, tagInput);

      handleHttp(
        res,
        { data: null, message: "¡Etiqueta creada exitosamente!" },
        201
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * @method getTagById - Recupera una etiqueta por su ID
   * @param {Request} req - Objeto de solicitud de Express que contiene el parámetro tagId
   * @param {Response} res - Objeto de respuesta de Express
   * @param {NextFunction} next - Función de middleware siguiente de Express
   * @returns {Promise<void>}
   */
  async getTagById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { tagId } = req.params;

      const tag = await tagsServiceContainer.findTagById.run(tagId as string);

      handleHttp(
        res,
        { data: tag, message: "¡Etiqueta cargada exitosamente!" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * @method getTags - Recupera etiquetas paginadas para el usuario autenticado con filtros opcionales
   * @param {RequestExtended} req - Objeto de solicitud extendido que contiene información del usuario y filtros de consulta
   * @param {Response} res - Objeto de respuesta de Express
   * @param {NextFunction} next - Función de middleware siguiente de Express
   * @returns {Promise<void>}
   */
  async getTags(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const query = req.query as TagFiltersInput;

      const paginatedTags = await tagsServiceContainer.findTags.run(
        userId,
        query
      );

      handleHttp(
        res,
        {
          data: {
            ...paginatedTags,
            records: paginatedTags.records.map((r) => toTagOutputDto(r)),
          },
          message: "¡Etiquetas cargadas exitosamente!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * @method patchTag - Actualiza una etiqueta existente para el usuario autenticado
   * @param {RequestExtended} req - Objeto de solicitud extendido que contiene información del usuario, parámetro tagId y carga de actualización
   * @param {Response} res - Objeto de respuesta de Express
   * @param {NextFunction} next - Función de middleware siguiente de Express
   * @returns {Promise<void>}
   */
  async patchTag(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const { tagId } = req.params;
      const updatedTagInput = req.body as UpdateTagInput;

      await tagsServiceContainer.updateTag.run(
        userId,
        tagId as string,
        updatedTagInput
      );

      handleHttp(
        res,
        { data: null, message: "¡Etiqueta actualizada exitosamente!" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * @method deleteManyTags - Elimina multiples etiquetas  de un usuario por su ID
   * @param {Request} req - Objeto de solicitud de Express que contiene el cuerpo con los Ids de las etiquetas a eliminar
   * @param {Response} res - Objeto de respuesta de Express
   * @param {NextFunction} next - Función de middleware siguiente de Express
   * @returns {Promise<void>}
   */

  async deleteManyTags(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const { tagIds } = req.body as DeleteManyTagsInput;

      await tagsServiceContainer.deleteManyTags.run(userId, tagIds);

      handleHttp(
        res,
        { data: null, message: "¡Etiquetas eliminadas exitosamente!" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * @method postSyncTags - Sincroniza las etiquetas de un usuario
   * @param {Request} req - Objeto de solicitud de Express que contiene el parámetro userId y el cuerpo con las etiquetas a sincronizar
   * @param {Response} res - Objeto de respuesta de Express
   * @param {NextFunction} next - Función de middleware siguiente de Express
   * @returns {Promise<void>}
   */
  async postSyncTags(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const syncTagsInput = req.body as SyncTagsInput;

      await tagsServiceContainer.syncTags.run(userId, syncTagsInput);

      handleHttp(
        res,
        { data: null, message: "¡Etiquetas sincronizadas exitosamente!" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const tagsController = new TagsController();
