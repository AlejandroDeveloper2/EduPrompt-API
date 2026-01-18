import { EducationalResourceRepositoryType } from "../../domain/repositories/EducationalResourceRepository.interface";

import { SyncResourcesInput } from "../dto/syncResources.dto";

import { UsersFeature } from "@/features/users";

/**
 * Caso de uso para sincronizar recursos educativos de un usuario.
 *
 * Este caso de uso valida la existencia del usuario y luego recorre el listado de
 * recursos recibido. Para cada recurso:
 *  - Crea el recurso si no existe en el repositorio.
 *  - Actualiza los datos permitidos si el recurso ya existe.
 *
 * No retorna información; en caso de error lanzará la excepción correspondiente
 * desde las capas inferiores (servicios o repositorios).
 */
export class SyncResourcesUseCase {
  /**
   * Inicializa el caso de uso con el repositorio de recursos educativos.
   *
   * @param resourcesRepository Repositorio para acceder y modificar recursos educativos.
   */
  constructor(
    private readonly resourcesRepository: EducationalResourceRepositoryType
  ) {}

  /**
   * Ejecuta la sincronización de recursos para un usuario.
   *
   * 1) Verifica que el usuario exista.
   * 2) Itera sobre cada recurso en la entrada y:
   *    - Si no existe, lo crea con la información proporcionada.
   *    - Si existe, lo actualiza con los campos permitidos (por ahora: título y etiqueta de grupo).
   *
   * @param userId Identificador del usuario propietario de los recursos.
   * @param syncResourcesInput Objeto con el listado de recursos a sincronizar.
   * @returns Promesa que se resuelve cuando finaliza la operación.
   */
  async run(
    userId: string,
    syncResourcesInput: SyncResourcesInput
  ): Promise<void> {
    // Validamos si existe el usuario
    await UsersFeature.service.findUserProfile.run(userId);

    const { resources } = syncResourcesInput;

    // Valida y sincroniza cada recurso: crea si no existe, actualiza si existe
    await Promise.all(
      resources.map(
        async ({ resourceId, title, content, format, formatKey, groupTag }) => {
          const foundResource = await this.resourcesRepository.findById(
            resourceId
          );
          if (!foundResource)
            return await this.resourcesRepository.create(userId, {
              resourceId,
              title,
              content,
              format,
              formatKey,
              groupTag,
            });
          return await this.resourcesRepository.update(userId, resourceId, {
            title,
            groupTag,
          });
        }
      )
    );
  }
}
