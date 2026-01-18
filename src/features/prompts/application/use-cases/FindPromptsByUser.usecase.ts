import { PaginatedResponse } from "@/core/domain/types";

import { escapeForRegex, normalizeForSearch, safeDecode } from "@/shared/utils";

import { PromptRespositoryType } from "../../domain/repositories/PromptRepository.interface";
import { Prompt } from "../../domain/entities";

import { PromptsFiltersInput } from "../dto/findPromptsByUser.dto";

import { UsersFeature } from "@/features/users";

export class FindPromptsByUserUseCase {
  constructor(private readonly promptsRepository: PromptRespositoryType) {}
  /**
   * Obtiene los prompts de un usuario con filtros y paginación.
   *
   * @param userId - ID del usuario.
   * @param promptsFiltersInput - Filtros opcionales (título, etiqueta, página, límite).
   * @returns Respuesta paginada con los prompts del usuario.
   * @throws {AppError} Si el usuario no existe.
   */
  async run(
    userId: string,
    promptsFiltersInput: PromptsFiltersInput
  ): Promise<PaginatedResponse<Prompt>> {
    //Validamos que el Id de usuario este asociado a un usuario existente
    await UsersFeature.service.findUserProfile.run(userId);

    const { title, tag, page, limit } = promptsFiltersInput;

    const pageNumber = parseInt(page ?? "1", 10) || 1;
    const limitNumber = parseInt(limit ?? "10", 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const baseQuery: Record<string, unknown> = { userId };

    if (tag) baseQuery.tag = tag;

    // Si no hay filtro por título: consulta normal
    if (!title || title.trim() === "") {
      return this.promptsRepository.findAllByUser(baseQuery, {
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
      promptTitle: { $regex: `^${escaped}$`, $options: "i" },
    };
    const exactResult = await this.promptsRepository.findAllByUser(exactQuery, {
      limitNumber,
      pageNumber,
      skip,
    });
    if (exactResult.totalItems > 0) return exactResult;

    // 2) Fallback: búsqueda parcial
    const partialQuery = {
      ...baseQuery,
      promptTitle: { $regex: escaped, $options: "i" },
    };
    const partialResult = await this.promptsRepository.findAllByUser(
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
