import { EducationalResourceRepositoryType } from "../../domain/repositories/EducationalResourceRepository.interface";

import { CreateResourceInput } from "../dto/createResource.dto";

import { UsersFeature } from "@/features/users";

export class CreateEducationalResourceUseCase {
  constructor(
    private readonly resourcesRepository: EducationalResourceRepositoryType
  ) {}

  /**
   * Crea un nuevo recurso educativo.
   *
   * @param userId - Id del usuario propietario del recurso.
   * @param createResourceInput - Objeto con los datos del recurso.
   * @throws {AppError} Si el usuario no existe.
   */
  async run(
    userId: string,
    createResourceInput: CreateResourceInput
  ): Promise<void> {
    await UsersFeature.service.findUserProfile.run(userId);
    await this.resourcesRepository.create(userId, createResourceInput);
  }
}
