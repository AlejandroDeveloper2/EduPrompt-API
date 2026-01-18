import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { EducationalResourceRepositoryType } from "../../domain/repositories/EducationalResourceRepository.interface";

import { DeleteResourcesByIdInput } from "../dto/deleteManyResources.dto";

import { UsersFeature } from "@/features/users";

export class DeleteManyResourcesUseCase {
  constructor(
    private readonly resourcesRepository: EducationalResourceRepositoryType
  ) {}
  /**
   * Elimina múltiples recursos educativos de un usuario.
   *
   * @param userId - ID del usuario dueño de los recursos.
   * @param deleteResourcesByIdInput - Objeto con el array de IDs de recursos a eliminar.
   * @throws {AppError} Si el usuario no existe.
   * @throws {AppError} Si alguno de los recursos no existe.
   */
  async run(
    userId: string,
    deleteResourcesByIdInput: DeleteResourcesByIdInput
  ): Promise<void> {
    const { resourceIds } = deleteResourcesByIdInput;
    //Validamos si el userId pertenece a un usuario registrado
    await UsersFeature.service.findUserProfile.run(userId);

    const existingResources: number = await this.resourcesRepository.count(
      userId,
      resourceIds
    );

    if (existingResources < resourceIds.length)
      throw new AppError(
        ErrorMessages.SOME_RESOURCE_NOT_FOUND,
        404,
        "Some of the resources was not found",
        true
      );

    await this.resourcesRepository.deleteMany(userId, resourceIds);
  }
}
