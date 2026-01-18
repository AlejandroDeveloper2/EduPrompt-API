import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { PromptRespositoryType } from "../../domain/repositories/PromptRepository.interface";
import { Prompt } from "../../domain/entities";

export class FindPromptByIdUseCase {
  constructor(private readonly promptsRepository: PromptRespositoryType) {}
  /**
   * Busca un prompt por su ID.
   *
   * @param promptId - ID del prompt.
   * @returns El prompt.
   * @throws {AppError} Si el prompt no existe.
   */
  async run(promptId: string): Promise<Prompt> {
    const prompt = await this.promptsRepository.findById(promptId);
    if (!prompt)
      throw new AppError(
        ErrorMessages.PROMPT_NOT_FOUND,
        404,
        "Prompt does not exists in the database.",
        true
      );
    return prompt;
  }
}
