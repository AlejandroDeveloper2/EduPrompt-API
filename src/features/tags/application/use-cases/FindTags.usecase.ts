import { PaginatedResponse } from "@/core/domain/types";

import { escapeForRegex, normalizeForSearch, safeDecode } from "@/shared/utils";

import { Tag } from "../../domain/entities";
import { TagRepository } from "../../domain/repositories/TagRepository.interface";

import { TagFiltersInput } from "../dto/findTags.dto";

import { UsersFeature } from "@/features/users";

/**
 * Caso de uso para la búsqueda paginada de etiquetas (tags).
 *
 * Realiza las siguientes operaciones:
 * - Verifica la existencia del usuario propietario de las etiquetas.
 * - Construye la consulta base por usuario y tipo (si aplica).
 * - Aplica búsqueda exacta por nombre (insensible a mayúsculas/minúsculas) y,
 *   de no encontrar resultados, realiza una búsqueda parcial.
 */
export class FindTagsUseCase {
  /**
   * Crea una instancia del caso de uso FindTagsUseCase.
   * @param {TagRepository} tagRepository - Repositorio para acceder a los datos de etiquetas.
   */
  constructor(private readonly tagRepository: TagRepository) {}

  /**
   * Ejecuta la búsqueda de etiquetas de un usuario con paginación y filtros.
   *
   * Flujo:
   * 1) Valida el perfil del usuario.
   * 2) Si no se especifica "name", obtiene resultados usando sólo los filtros base y paginación.
   * 3) Si se especifica "name", intenta primero una coincidencia exacta; si no hay resultados,
   *    realiza una búsqueda parcial.
   *
   * @param {string} userId - Identificador del usuario propietario de las etiquetas.
   * @param {TagFiltersInput} tagFiltersInput - Filtros de búsqueda (name, type) y parámetros de paginación (page, limit).
   * @returns {Promise<PaginatedResponse<Tag>>} Respuesta paginada con las etiquetas encontradas.
   */
  async run(
    userId: string,
    tagFiltersInput: TagFiltersInput
  ): Promise<PaginatedResponse<Tag>> {
    await UsersFeature.service.findUserProfile.run(userId);
    const { name, type, page, limit } = tagFiltersInput;

    const pageNumber = parseInt(page ?? "1", 10) || 1;
    const limitNumber = parseInt(limit ?? "10", 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const baseQuery: Record<string, unknown> = { userId };

    if (type) baseQuery.type = type;

    // Si no hay filtro por título: consulta normal
    if (!name || name.trim() === "") {
      return this.tagRepository.findTags(baseQuery, {
        limitNumber,
        pageNumber,
        skip,
      });
    }

    // Sanitizar / decodificar / escapar
    const decoded = safeDecode(name.trim());
    const normalized = normalizeForSearch(decoded);
    const escaped = escapeForRegex(normalized);

    // 1) Intento exacto (ignora mayúsc/minúsc)
    const exactQuery = {
      ...baseQuery,
      name: { $regex: `^${escaped}$`, $options: "i" },
    };
    const exactResult = await this.tagRepository.findTags(exactQuery, {
      limitNumber,
      pageNumber,
      skip,
    });
    if (exactResult.totalItems > 0) return exactResult;

    // 2) Fallback: búsqueda parcial
    const partialQuery = {
      ...baseQuery,
      name: { $regex: escaped, $options: "i" },
    };
    const partialResult = await this.tagRepository.findTags(partialQuery, {
      limitNumber,
      pageNumber,
      skip,
    });
    return partialResult;
  }
}
