import { PaginatedResponse } from "@/core/domain/types";

import { escapeForRegex, normalizeForSearch, safeDecode } from "@/shared/utils";

import { EducationalResourceRepositoryType } from "../../domain/repositories/EducationalResourceRepository.interface";
import { EducationalResource } from "../../domain/entities";

import { ResourcesFiltersInput } from "../dto/findResourcesByUser.dto";

import { UsersFeature } from "@/features/users";

export class FindEducationalResourcesByUserUseCase {
  constructor(
    private readonly resourcesRepository: EducationalResourceRepositoryType
  ) {}

  /**
   * Obtiene los recursos educativos de un usuario con filtros y paginación.
   *
   * @param userId - ID del usuario.
   * @param resourcesFiltersInput - Filtros opcionales (título, formato, página, límite).
   * @returns Respuesta paginada con los recursos del usuario.
   * @throws {AppError} Si el usuario no existe.
   */
  async run(
    userId: string,
    resourcesFiltersInput: ResourcesFiltersInput
  ): Promise<PaginatedResponse<EducationalResource>> {
    //Validamos si el userId pertenece a un usuario registrado
    await UsersFeature.service.findUserProfile.run(userId);

    const { title, formatKey, tag, page, limit } = resourcesFiltersInput;

    const pageNumber = parseInt(page ?? "1", 10) || 1;
    const limitNumber = parseInt(limit ?? "10", 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const baseQuery: Record<string, unknown> = { userId };
    if (formatKey) baseQuery.formatKey = formatKey;
    if (tag) baseQuery.groupTag = tag;

    // Si no hay filtro por título: consulta normal
    if (!title || title.trim() === "") {
      return this.resourcesRepository.findAllByUser(baseQuery, {
        limitNumber,
        pageNumber,
        skip,
      });
    }

    // Sanitizar / decodificar / escapar
    const decoded = safeDecode(title.trim());
    const normalized = normalizeForSearch(decoded);
    const escaped = escapeForRegex(normalized);

    // 1) Intento exacto (ignora mayúsc/minúsc)
    const exactQuery = {
      ...baseQuery,
      title: { $regex: `^${escaped}$`, $options: "i" },
    };
    const exactResult = await this.resourcesRepository.findAllByUser(
      exactQuery,
      {
        limitNumber,
        pageNumber,
        skip,
      }
    );
    if (exactResult.totalItems > 0) return exactResult;

    // 2) Fallback: búsqueda parcial
    const partialQuery = {
      ...baseQuery,
      title: { $regex: escaped, $options: "i" },
    };
    const partialResult = await this.resourcesRepository.findAllByUser(
      partialQuery,
      {
        limitNumber,
        pageNumber,
        skip,
      }
    );
    return partialResult;
  }
}
