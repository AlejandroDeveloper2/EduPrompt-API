import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { Tag } from "../../domain/entities";
import { TagRepository } from "../../domain/repositories/TagRepository.interface";

/**
 * Caso de uso para encontrar una etiqueta por su ID.
 *
 * @class FindTagByIdUseCase
 * @description Recupera una etiqueta del repositorio usando el ID de etiqueta proporcionado.
 * Lanza un error si la etiqueta no se encuentra.
 *
 * @example
 * ```typescript
 * const useCase = new FindTagByIdUseCase(tagRepository);
 * const tag = await useCase.run('tag-123');
 * ```
 */
export class FindTagByIdUseCase {
  /**
   * Crea una instancia de FindTagByIdUseCase.
   *
   * @param {TagRepository} tagRepository - La instancia del repositorio utilizada para obtener etiquetas.
   */

  constructor(private readonly tagRepository: TagRepository) {}
  /**
   * Ejecuta el caso de uso para encontrar una etiqueta por su ID.
   *
   * @param {string} tagId - El ID de la etiqueta a encontrar.
   * @returns {Promise<Tag>} Una promesa que se resuelve en la etiqueta encontrada.
   * @throws {AppError} Lanza un error con estado 404 si la etiqueta no se encuentra.
   */
  async run(tagId: string): Promise<Tag> {
    const tag = await this.tagRepository.findTagById(tagId);
    if (!tag)
      throw new AppError(
        ErrorMessages.TAG_NOT_FOUND,
        404,
        `La etiqueta con el id ${tagId} no fue encontrada`,
        true
      );
    return tag;
  }
}
