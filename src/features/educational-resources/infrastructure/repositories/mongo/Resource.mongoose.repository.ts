import { PaginatedResponse } from "@/core/domain/types";

import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { EducationalResourceRepositoryType } from "../../../domain/repositories/EducationalResourceRepository.interface";
import { EducationalResource } from "../../../domain/entities";
import { CreateResource, UpdateResource } from "../../../domain/types";

import { EducationalResourceModel } from "./EducationalResource.model";

/**
 * Repositorio para gestionar recursos educativos usando MongoDB.
 * Implementa el contrato definido en `EducationalResourceRepositoryType`.
 */
export class EducationalResourceMongoRepository
  implements EducationalResourceRepositoryType
{
  /**
   * Crea un nuevo recurso educativo en la base de datos.
   *
   * @param userId - ID del usuario propietario del recurso
   * @param newResource - Objeto con los datos del recurso a crear.
   * @throws {AppError} Si ocurre un error durante la creación.
   */
  async create(userId: string, newResource: CreateResource): Promise<void> {
    try {
      await EducationalResourceModel.create({ ...newResource, userId });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while creating resource: ${error}`,
        false
      );
    }
  }

  /**
   * Obtiene todos los recursos educativos de un usuario con filtros y paginación.
   *
   * @param query - Objeto con los diferentes filtros opcionales (título, formato, etiqueta).
   * @param pagination - Objeto con las variables parseadas de paginación (página, límite, skip).
   * @returns Respuesta paginada con los recursos educativos.
   * @throws {AppError} Si ocurre un error durante la consulta.
   */
  async findAllByUser(
    query: Record<string, unknown>,
    pagination: {
      limitNumber: number;
      pageNumber: number;
      skip: number;
    }
  ): Promise<PaginatedResponse<EducationalResource>> {
    try {
      const { skip, pageNumber, limitNumber } = pagination;

      const resources = await EducationalResourceModel.find(query)
        .skip(skip)
        .limit(limitNumber)
        .exec();

      const totalItems: number = await EducationalResourceModel.countDocuments(
        query
      );

      return {
        records: resources.map((r) => {
          const {
            resourceId,
            title,
            content,
            format,
            formatKey,
            groupTag,
            creationDate,
            userId,
          } = r.toObject();
          return new EducationalResource(
            resourceId,
            title,
            content,
            format,
            formatKey,
            groupTag,
            creationDate,
            userId
          );
        }),
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalItems / limitNumber),
        totalItems,
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while finding resources: ${error}`,
        false
      );
    }
  }

  /**
   * Busca un recurso educativo por su ID.
   *
   * @param resourceId - ID del recurso a buscar.
   * @returns El recurso educativo o `null` si no existe.
   * @throws {AppError} Si ocurre un error durante la búsqueda.
   */
  async findById(resourceId: string): Promise<EducationalResource | null> {
    try {
      const educationalResource = await EducationalResourceModel.findOne({
        resourceId,
      });

      if (!educationalResource) return null;

      const {
        resourceId: id,
        title,
        content,
        format,
        formatKey,
        groupTag,
        creationDate,
        userId,
      } = educationalResource.toObject();
      return new EducationalResource(
        id,
        title,
        content,
        format,
        formatKey,
        groupTag,
        creationDate,
        userId
      );
    } catch (error: unknown) {
      console.log(error);
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while finding resource by id: ${error}`,
        false
      );
    }
  }
  /**
   * Actualiza un recurso educativo de un usuario.
   *
   * @param userId - ID del usuario dueño de los recursos.
   * @param resourceId - ID del recurso a actualizar.
   * @param updatedResource - Objeto con los datos del recurso a actualizar
   * @throws {AppError} Si ocurre un error durante la actualización.
   */
  async update(
    userId: string,
    resourceId: string,
    updatedResource: UpdateResource
  ): Promise<void | null> {
    try {
      const result = await EducationalResourceModel.findOneAndUpdate(
        { userId, resourceId },
        { ...updatedResource }
      );
      if (!result) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while updating resource: ${error}`,
        false
      );
    }
  }
  /**
   * Elimina múltiples recursos educativos de un usuario.
   *
   * @param userId - ID del usuario dueño de los recursos.
   * @param resourceIds - Array de IDs de los recursos a eliminar.
   * @throws {AppError} Si ocurre un error durante la eliminación.
   */
  async deleteMany(userId: string, resourceIds: string[]): Promise<void> {
    try {
      await EducationalResourceModel.deleteMany({
        userId,
        resourceId: { $in: resourceIds },
      });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while deleting selected resources: ${error}`,
        false
      );
    }
  }

  /**
   * Cuenta recursos educativos de un usuario por los Ids que coincidan.
   *
   * @param userId - ID del usuario dueño de los recursos educativos.
   * @param promptIds - Array de IDs de los recursos a buscar y contar.
   * @throws {AppError} Si ocurre un error durante el conteo.
   */
  async count(userId: string, resourcesIds: string[]): Promise<number> {
    try {
      return await EducationalResourceModel.countDocuments({
        userId,
        resourceId: { $in: resourcesIds },
      });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while counting resources by user id: ${error}`,
        false
      );
    }
  }
}
