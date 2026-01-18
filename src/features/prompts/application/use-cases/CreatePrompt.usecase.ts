import { PromptRespositoryType } from "../../domain/repositories/PromptRepository.interface";

import { CreatePromptInput } from "../dto/createPrompt.dto";

import { UsersFeature } from "@/features/users";

export class CreatePromptUseCase {
  constructor(private readonly promptsRepository: PromptRespositoryType) {}
  /**
   * Crea un nuevo prompt.
   *
   * @param userId - Id del usuario propietario del prompt.
   * @param newPrompt - Objeto con los datos del prompt.
   * @throws {AppError} Si el usuario no existe.
   */
  async run(
    userId: string,
    createPromptInput: CreatePromptInput
  ): Promise<void> {
    //Validamos que el Id de usuario este asociado a un usuario existente
    await UsersFeature.service.findUserProfile.run(userId);

    await this.promptsRepository.create(userId, createPromptInput);
  }
}
