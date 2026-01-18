import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { EducationalResourceRepositoryType } from "../../domain/repositories/EducationalResourceRepository.interface";

import { UpdateResourceInput } from "../dto/updateResource.dto";

import { UsersFeature } from "@/features/users";

export class UpdateEducationalResourceUseCase {
  constructor(
    private readonly resourcesRepository: EducationalResourceRepositoryType
  ) {}
  /**
   * Actualiza un recurso educativo.
   *
   * @param userId - ID del usuario dueño del recurso.
   * @param resourceId - ID del recurso.
   * @param updateResourceInput -  Objeto con los datos actualizados del recurso.
   * @throws {AppError} Si el usuario no existe.
   * @throws {AppError} Si el recurso no existe.
   */
  async run(
    userId: string,
    resourceId: string,
    updateResourceInput: UpdateResourceInput
  ): Promise<void> {
    //Validamos si el userId pertenece a un usuario registrado
    await UsersFeature.service.findUserProfile.run(userId);

    const result = await this.resourcesRepository.update(
      userId,
      resourceId,
      updateResourceInput
    );

    if (result === null)
      throw new AppError(
        ErrorMessages.RESOURCE_NOT_FOUND,
        404,
        "Resource not found",
        true
      );
  }
}
