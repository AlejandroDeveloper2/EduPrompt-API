import { Response, Request, NextFunction } from "express";

import { RequestExtended } from "@/core/infrastructure/types";

import { handleHttp } from "@/shared/utils";

import { toResourceOutputDto } from "../../application/mappers";
import { CreateResourceInput } from "../../application/dto/createResource.dto";
import { ResourcesFiltersInput } from "../../application/dto/findResourcesByUser.dto";
import { DeleteResourcesByIdInput } from "../../application/dto/deleteManyResources.dto";
import { UpdateResourceInput } from "../../application/dto/updateResource.dto";
import { SyncResourcesInput } from "../../application/dto/syncResources.dto";

import { ResourcesServiceContainer } from "../containers/ResourcesService.container";

const resourcesServiceContainer = new ResourcesServiceContainer();
/**
 * Controller encargado de manejar las operaciones relacionadas con recursos educativos.
 *
 * Se encarga de recibir las solicitudes HTTP, validarlas y delegar la lógica de negocio
 * al servicio `EducationalResourceService`. Retorna las respuestas en un formato unificado.
 */
class EducationalResourceController {
  /**
   * Crea un nuevo recurso educativo.
   *
   * @route POST /resources
   * @param {Request} req - Objeto de solicitud con `userId` y los datos del recurso en el body.
   * @param {Response} res - Objeto de respuesta para enviar el resultado.
   * @param {NextFunction} next - Función para pasar errores al middleware global.
   * @returns {Promise<void>} Envía un 201 si el recurso fue creado exitosamente.
   */
  async postEducationalResource(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const resourceInput = req.body as CreateResourceInput;

      await resourcesServiceContainer.createEducationalResource.run(
        userId,
        resourceInput
      );

      handleHttp(
        res,
        { data: null, message: "Resource created successfully!" },
        201
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Obtiene todos los recursos educativos de un usuario autenticado, con filtros opcionales.
   *
   * @route GET /resources
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y filtros de query.
   * @param {Response} res - Objeto de respuesta con los recursos paginados.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 con los recursos encontrados.
   */
  async getEducationalResourcesByUser(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const query = req.query as ResourcesFiltersInput;

      const paginatedResources =
        await resourcesServiceContainer.findEducationalResourcesByUser.run(
          userId,
          query
        );

      handleHttp(
        res,
        {
          data: {
            ...paginatedResources,
            records: paginatedResources.records.map((r) =>
              toResourceOutputDto(r)
            ),
          },
          message: "Resources loaded successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Obtiene un recurso educativo por su ID.
   *
   * @route GET /resources/:resourceId
   * @param {Request} req - Objeto de solicitud con `resourceId` en los parámetros de ruta.
   * @param {Response} res - Objeto de respuesta con el recurso encontrado.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 con el recurso encontrado.
   */
  async getEducationalResourceById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { resourceId } = req.params;

      const educationalResource =
        await resourcesServiceContainer.findEducationalResourceById.run(
          resourceId as string
        );

      handleHttp(
        res,
        {
          data: toResourceOutputDto(educationalResource),
          message: "Resource loaded successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Actualiza un recurso educativo.
   *
   * @route PATCH /resources/:resourceId
   * @param {RequestExtended} req - Objeto de solicitud con `resourceId`, `userId` y el recurso actualizado.
   * @param {Response} res - Objeto de respuesta.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 si la actualización fue exitosa.
   */
  async patchResource(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { resourceId } = req.params;
      const { userId } = req.user ?? { userId: "" };
      const payload = req.body as UpdateResourceInput;

      await resourcesServiceContainer.updateEducationalResource.run(
        userId,
        resourceId as string,
        payload
      );

      handleHttp(
        res,
        {
          data: null,
          message: "Resource updated successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Elimina múltiples recursos educativos de un usuario.
   *
   * @route DELETE /resources
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y un arreglo de IDs de recursos.
   * @param {Response} res - Objeto de respuesta.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 si los recursos fueron eliminados exitosamente.
   */
  async deleteManyResources(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const payload = req.body as DeleteResourcesByIdInput;

      await resourcesServiceContainer.deleteManyResources.run(userId, payload);

      handleHttp(
        res,
        {
          data: null,
          message: "Resources deleted successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * @method postSyncResources - Sincroniza los recursos de un usuario
   * @param {Request} req - Objeto de solicitud de Express que contiene el parámetro userId y el cuerpo con los recursos a sincronizar
   * @param {Response} res - Objeto de respuesta de Express
   * @param {NextFunction} next - Función de middleware siguiente de Express
   * @returns {Promise<void>}
   */
  async postSyncResources(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const syncResourcesInput = req.body as SyncResourcesInput;

      await resourcesServiceContainer.syncResources.run(
        userId,
        syncResourcesInput
      );

      handleHttp(
        res,
        { data: null, message: "¡Recursos sincronizadas exitosamente!" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const educationalResourceController =
  new EducationalResourceController();
