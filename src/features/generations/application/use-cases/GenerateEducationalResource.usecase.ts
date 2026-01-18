import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { Generation } from "../../domain/entities";
import { GenerationRepositoryType } from "../../domain/repositories/GenerationRepository.interface";
import { ResourceFormatKey } from "../../domain/types/types";
import { AssistantInstructionsService } from "../../domain/services/AssistantInstructions.service";

import { GenerationInput } from "../dto/generateEducationalResource.dto";

export class GenerateEducationalResourceUseCase {
  constructor(
    private readonly assistantInstructionsService: AssistantInstructionsService,
    private readonly generationRepository: GenerationRepositoryType
  ) {}

  /**
   * Genera un recurso educativo (texto o imagen) a partir del prompt del usuario.
   *
   * Para imágenes, primero genera un prompt visual con instrucciones específicas y
   * luego solicita la imagen al repositorio. Para texto, utiliza instrucciones
   * generales de asistente para obtener el contenido textual.
   *
   * @param {ResourceFormatKey} resourceFormatkey - Tipo de recurso a generar ("image" u otros formatos de texto).
   * @param {GenerationInput} generationInput - Objeto con el prompt original proporcionado por el usuario.
   * @returns {Promise<AssistantResponse>} Respuesta con el resultado generado y su fecha.
   * @throws {AppError} Si no se puede completar la generación de imagen.
   */
  async run(
    resourceFormatkey: ResourceFormatKey,
    generationInput: GenerationInput
  ): Promise<Generation> {
    const { userPrompt } = generationInput;

    if (resourceFormatkey === "image") {
      const imageInstructions: string =
        await this.assistantInstructionsService.getImageInstructions();

      const { result: visualPrompt } =
        await this.generationRepository.generateTextResource(
          imageInstructions,
          userPrompt
        );

      const assistantImageResponse =
        await this.generationRepository.generateImageResource(visualPrompt);

      if (!assistantImageResponse)
        throw new AppError(
          ErrorMessages.IMAGE_GENERATION_NOT_COMPLETED,
          400,
          "It couldn't generate the image",
          true
        );

      const { generationDate, result } = assistantImageResponse;

      return {
        generationDate,
        result,
      };
    }
    const genericInstructions: string =
      await this.assistantInstructionsService.getGenericInstructions();

    const assistantResponse =
      await this.generationRepository.generateTextResource(
        genericInstructions,
        userPrompt
      );
    return assistantResponse;
  }
}
