import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { TagRepository } from "../../domain/repositories/TagRepository.interface";

import { UsersFeature } from "@/features/users";

/**
 * Caso de uso para eliminar múltiples etiquetas pertenecientes a un usuario.
 *
 * @remarks
 * Valida que el perfil del usuario exista antes de proceder. Delegará la eliminación
 * al repositorio de etiquetas y verificará que la cantidad de elementos eliminados
 * coincida con la cantidad solicitada. Si alguna etiqueta no existe, se lanzará un
 * {@link AppError} con código 404 usando {@link ErrorMessages.SOME_TAG_NOT_FOUND}.
 *
 * @example
 * // Eliminación de varias etiquetas por sus IDs
 * const useCase = new DeleteManyTagsUseCase(tagRepository);
 * await useCase.run('usuario-123', ['tag-1', 'tag-2', 'tag-3']);
 *
 * @param tagRepository - Instancia del repositorio para la gestión de etiquetas.
 */
export class DeleteManyTagsUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  /**
   * Ejecuta la eliminación masiva de etiquetas para un usuario específico.
   *
   * Verifica primero la existencia del usuario. Luego solicita al repositorio
   * eliminar todas las etiquetas indicadas. Si el número de eliminadas es menor
   * al total solicitado, se asume que alguna(s) no existe(n) y se arroja un error 404.
   *
   * @param userId - Identificador del usuario propietario de las etiquetas.
   * @param tagIds - Lista de identificadores de etiquetas a eliminar.
   * @returns Promesa que se resuelve cuando la operación finaliza.
   * @throws {AppError} Si el usuario no existe o si alguna etiqueta no se encuentra.
   */
  async run(userId: string, tagIds: string[]): Promise<void> {
    await UsersFeature.service.findUserProfile.run(userId);

    const deletedCount = await this.tagRepository.deleteManyTags(
      userId,
      tagIds
    );

    if (deletedCount < tagIds.length)
      throw new AppError(
        ErrorMessages.SOME_TAG_NOT_FOUND,
        404,
        "Alguna etiqueta a eliminar de la lista  no existe en la base de datos.",
        true
      );
  }
}
