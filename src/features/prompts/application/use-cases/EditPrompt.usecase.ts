import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { PromptRespositoryType } from "../../domain/repositories/PromptRepository.interface";

import { UpdatePromptInput } from "../dto/updatePrompt.dto";

import { UsersFeature } from "@/features/users";

export class EditPromptUseCase {
  constructor(private readonly promptsRepository: PromptRespositoryType) {}

  /**
   * Actualiza los datos de un prompt.
   *
   * @param userId - ID del usuario dueño del prompt.
   * @param promptId - ID del prompt.
   * @param updatePromptInput - Objeto con los datos del prompt actualizados.
   * @throws {AppError} Si el usuario no existe.
   * @throws {AppError} Si el prompt no existe.
   */
  async run(
    userId: string,
    promptId: string,
    updatePromptInput: UpdatePromptInput
  ): Promise<void> {
    //Validamos que el Id de usuario este asociado a un usuario existente
    await UsersFeature.service.findUserProfile.run(userId);

    const result = await this.promptsRepository.update(
      userId,
      promptId,
      updatePromptInput
    );

    if (result === null)
      throw new AppError(
        ErrorMessages.PROMPT_NOT_FOUND,
        404,
        "Prompt does not exists in the database.",
        true
      );
  }
}
