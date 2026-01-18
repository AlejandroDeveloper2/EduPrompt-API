import { TagRepository } from "../../domain/repositories/TagRepository.interface";

import { CreateTagInput } from "../dto/createTag.dto";

/**
 * Caso de uso para crear una nueva etiqueta.
 *
 * @class CreateTagUseCase
 * @example
 * const useCase = new CreateTagUseCase(tagRepository);
 * await useCase.run(userId, createTagInput);
 */
export class CreateTagUseCase {
  /**
   * Crea una instancia de CreateTagUseCase.
   *
   * @param {TagRepository} tagRepository - El repositorio para operaciones de acceso a datos de etiquetas.
   */
  constructor(private readonly tagRepository: TagRepository) {}

  /**
   * Ejecuta el caso de uso de crear etiqueta.
   *
   * @param {string} userId - El ID del usuario que crea la etiqueta.
   * @param {CreateTagInput} createTagInput - Los datos de entrada para crear la etiqueta.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la etiqueta se crea.
   * @throws {Error} Puede lanzar un error si la creación de la etiqueta falla.
   */
  async run(userId: string, createTagInput: CreateTagInput): Promise<void> {
    await this.tagRepository.createTag(userId, createTagInput);
  }
}
