import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { EducationalResourceRepositoryType } from "../../domain/repositories/EducationalResourceRepository.interface";
import { EducationalResource } from "../../domain/entities";

export class FindEducationalResourceByIdUseCase {
  constructor(
    private readonly resourcesRepository: EducationalResourceRepositoryType
  ) {}
  /**
   * Busca un recurso educativo por su ID.
   *
   * @param resourceId - ID del recurso.
   * @returns El recurso educativo.
   * @throws {AppError} Si el recurso no existe.
   */
  async run(resourceId: string): Promise<EducationalResource> {
    const resource = await this.resourcesRepository.findById(resourceId);
    if (!resource)
      throw new AppError(
        ErrorMessages.RESOURCE_NOT_FOUND,
        404,
        "Resource not found",
        true
      );
    return resource;
  }
}
