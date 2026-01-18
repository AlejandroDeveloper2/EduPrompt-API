import { AppError } from "@/core/domain/exeptions/AppError";
import { PaginatedResponse } from "@/core/domain/types";

import { ErrorMessages } from "@/shared/utils";

import { Tag } from "@/features/tags/domain/entities";
import { TagRepository } from "@/features/tags/domain/repositories/TagRepository.interface";
import { CreateTag, Pagination, UpdateTag } from "@/features/tags/domain/types";

import { TagModel } from "./Tag.model";

/**
 * Repositorio Mongo de etiquetas.
 * Implementa las operaciones CRUD usando Mongoose y mapea los resultados a entidades de dominio.
 */
export class TagMongoRepository implements TagRepository {
  /**
   * Crea una nueva etiqueta en la base de datos.
   * @param {string} userId - Id del usuario propietario de la etiqueta.
   * @param {CreateTag} newTag - Datos necesarios para crear la etiqueta.
   * @returns {Promise<void>} Promesa que se resuelve cuando la operación finaliza.
   * @throws {AppError} Lanza un error de aplicación si ocurre un problema al persistir los datos.
   */
  async createTag(userId: string, newTag: CreateTag): Promise<void> {
    try {
      await TagModel.create({ ...newTag, userId });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "Ha ocurrido un error al crear la etiqueta: " + error,
        false
      );
    }
  }

  /**
   * Busca una etiqueta por su identificador.
   * @param {string} tagId - Identificador único de la etiqueta.
   * @returns {Promise<Tag|null>} La etiqueta encontrada mapeada a entidad de dominio o null si no existe.
   * @throws {AppError} Lanza un error de aplicación si ocurre un problema al consultar los datos.
   */
  async findTagById(tagId: string): Promise<Tag | null> {
    try {
      const tag = await TagModel.findOne({ tagId });
      if (!tag) return null;
      const { name, type, sync, userId } = tag.toObject();
      return new Tag(tag.tagId, name, type, sync, userId);
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "Ha ocurrido un error al obtener la etiqueta: " + error,
        false
      );
    }
  }

  /**
   * Obtiene un listado paginado de etiquetas a partir de un filtro.
   * @param {Record<string, unknown>} query - Filtro de búsqueda para MongoDB.
   * @param {Pagination} pagination - Parámetros de paginación (skip, pageNumber, limitNumber).
   * @returns {Promise<PaginatedResponse<Tag>>} Respuesta paginada con los registros mapeados.
   * @throws {AppError} Lanza un error de aplicación si ocurre un problema al consultar los datos.
   */
  async findTags(
    query: Record<string, unknown>,
    pagination: Pagination
  ): Promise<PaginatedResponse<Tag>> {
    try {
      const { skip, pageNumber, limitNumber } = pagination;

      const tags = await TagModel.find(query)
        .skip(skip)
        .limit(limitNumber)
        .exec();

      const totalItems: number = await TagModel.countDocuments(query);

      return {
        records: tags.map((t) => {
          const { name, type, sync, userId } = t.toObject();
          return new Tag(t.tagId, name, type, sync, userId);
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
        "Ha ocurrido un error al obtener las etiquetas: " + error,
        false
      );
    }
  }

  /**
   * Actualiza una etiqueta existente.
   * @param {string} userId - Id del usuario propietario de la etiqueta.
   * @param {string} tagId - Identificador de la etiqueta a actualizar.
   * @param {UpdateTag} updatedTag - Campos a modificar en la etiqueta.
   * @returns {Promise<void|null>} null cuando no se encuentra la etiqueta, void si se actualiza correctamente.
   * @throws {AppError} Lanza un error de aplicación si ocurre un problema al actualizar.
   */
  async updateTag(
    userId: string,
    tagId: string,
    updatedTag: UpdateTag
  ): Promise<void | null> {
    try {
      const tag = await TagModel.findOneAndUpdate(
        { tagId, userId },
        { ...updatedTag }
      );
      if (!tag) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "Ha ocurrido un error al actualizar la etiqueta: " + error,
        false
      );
    }
  }

  /**
   * Elimina multiples etiquetas de un usuario por su identificador.
   * @param {string} userId - Id del usuario propietario de las etiquetas
   * @param {string[]} tagIds - Lista de etiquetas a eliminar.
   * @returns {Promise<number>} Devuelve el número de elementos eliminados.
   * @throws {AppError} Lanza un error de aplicación si ocurre un problema al eliminar.
   */
  async deleteManyTags(userId: string, tagIds: string[]): Promise<number> {
    try {
      const result = await TagModel.deleteMany({
        userId,
        tagId: { $in: tagIds },
      });
      return result.deletedCount;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "Ha ocurrido un error al eliminar las etiquetas: " + error,
        false
      );
    }
  }
}
