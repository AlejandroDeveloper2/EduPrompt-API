import { UsersFeature } from "@/features/users";

import { TagRepository } from "../../domain/repositories/TagRepository.interface";

import { SyncTagsInput } from "../dto/syncTags.dto";

/**
 * Caso de uso para sincronizar etiquetas (tags) de un usuario.
 *
 * Este caso de uso verifica la existencia del usuario y luego, para cada tag
 * recibido, crea la etiqueta si no existe o actualiza sus datos si ya existe.
 */
export class SyncTagsUseCase {
  /**
   * Crea una instancia del caso de uso de sincronización de etiquetas.
   * @param tagRepository Repositorio de etiquetas que provee operaciones de lectura y escritura.
   */
  constructor(private readonly tagRepository: TagRepository) {}

  /**
   * Sincroniza el conjunto de etiquetas de un usuario.
   *
   * Primero valida que el perfil del usuario exista. Luego, para cada tag en la
   * entrada, intenta localizarlo por su identificador: si no existe, lo crea; si
   * existe, lo actualiza con los datos proporcionados.
   *
   * @param userId Identificador del usuario dueño de las etiquetas.
   * @param syncTagsInput Objeto con la colección de tags a sincronizar.
   * @returns Promesa que se resuelve cuando finaliza la operación de sincronización.
   */
  async run(userId: string, syncTagsInput: SyncTagsInput): Promise<void> {
    // Validamos si existe el usuario
    await UsersFeature.service.findUserProfile.run(userId);

    const { tags } = syncTagsInput;

    // Valida y sincroniza cada tag: crea si no existe, actualiza si existe
    await Promise.all(
      tags.map(async ({ tagId, type, name, sync }) => {
        const foundTag = await this.tagRepository.findTagById(tagId);
        if (!foundTag)
          return await this.tagRepository.createTag(userId, {
            type,
            name,
            tagId,
          });
        return await this.tagRepository.updateTag(userId, tagId, {
          name,
          type,
          sync,
        });
      })
    );
  }
}
