import { UsersFeature } from "@/features/users";

import { PromptRespositoryType } from "../../domain/repositories/PromptRepository.interface";

import { SyncPromptsInput } from "../dto/syncPrompts.dto";

/**
 * Caso de uso para sincronizar prompts de un usuario.
 *
 * Verifica que el usuario exista y, por cada prompt recibido, crea o actualiza
 * su registro en el repositorio según corresponda.
 */
export class SyncPromptsUseCase {
  /**
   * Crea una instancia del caso de uso de sincronización de prompts.
   * @param promptsRepository Repositorio de prompts utilizado para consultar, crear y actualizar.
   */
  constructor(private readonly promptsRepository: PromptRespositoryType) {}

  /**
   * Ejecuta la sincronización de prompts para un usuario específico.
   *
   * Flujo:
   * 1. Valida que el usuario exista.
   * 2. Para cada prompt del payload: si no existe se crea, si existe se actualiza.
   *
   * @param userId ID del usuario dueño de los prompts.
   * @param syncPromptsInput Objeto con la lista de prompts a sincronizar.
   * @returns Promesa que se resuelve cuando la sincronización concluye.
   */
  async run(userId: string, syncPromptsInput: SyncPromptsInput) {
    // Validamos si existe el usuario
    await UsersFeature.service.findUserProfile.run(userId);

    await Promise.all(
      syncPromptsInput.prompts.map(
        async ({ promptId, promptTitle, promptText, tag }) => {
          const foundPrompt = await this.promptsRepository.findById(promptId);
          if (!foundPrompt)
            return await this.promptsRepository.create(userId, {
              promptId,
              promptTitle,
              promptText,
              tag,
            });
          return await this.promptsRepository.update(userId, promptId, {
            promptTitle,
            promptText,
            tag,
          });
        }
      )
    );
  }
}
