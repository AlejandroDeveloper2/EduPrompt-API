import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { TagRepository } from "../../domain/repositories/TagRepository.interface";
import { UpdateTag } from "../../domain/types";

import { UpdateTagInput } from "../dto/updateTag.dto";

/**
 * Caso de uso para actualizar una etiqueta existente.
 *
 * @class UpdateTagUseCase
 * @example
 * const updateTagUseCase = new UpdateTagUseCase(tagRepository);
 * await updateTagUseCase.run(userId, tagId, updateTagInput);
 */
export class UpdateTagUseCase {
  /**
   * Crea una instancia de UpdateTagUseCase.
   *
   * @param {TagRepository} tagRepository - El repositorio para acceso a datos de etiquetas
   */
  constructor(private readonly tagRepository: TagRepository) {}

  /**
   * Ejecuta el caso de uso de actualización de etiqueta.
   *
   * @param {string} userId - El ID del usuario que realiza la actualización
   * @param {string} tagId - El ID de la etiqueta a actualizar
   * @param {UpdateTagInput} updateTagInput - El objeto de entrada con los datos de actualización de la etiqueta
   * @returns {Promise<void>}
   * @throws {AppError} Lanza un error con estado 404 si la etiqueta no se encuentra
   * @example
   * await updateTagUseCase.run('user123', 'tag456', { name: 'Nuevo Nombre de Etiqueta' });
   */
  async run(
    userId: string,
    tagId: string,
    updateTagInput: UpdateTagInput
  ): Promise<void> {
    const result = await this.tagRepository.updateTag(
      userId,
      tagId,
      updateTagInput as UpdateTag
    );
    if (result === null)
      throw new AppError(
        ErrorMessages.TAG_NOT_FOUND,
        404,
        `La etiqueta con el id ${tagId} no fue encontrada`,
        true
      );
  }
}
