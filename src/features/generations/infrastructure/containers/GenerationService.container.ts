import { AssistantInstructionsService } from "../../domain/services/AssistantInstructions.service";

import { GenerateEducationalResourceUseCase } from "../../application/use-cases";

import { GenerationOpenAIRepository } from "../repositories";
import { FileInstructionsAdapter } from "../adapters/FileInstructions.adapter";

const generationRepository = new GenerationOpenAIRepository();

/** Servicio de dominio para obtener las instrucciones del asistente generador de recursos educativos */
const assistantInstructionsService = new AssistantInstructionsService(
  new FileInstructionsAdapter()
);

/**
 * Contenedor de servicios de generación de recursos.
 *
 * Expone casos de uso de generación ya inicializados con el repositorio de
 * OpenAI, facilitando su inyección en controladores u otras capas.
 *
 * Propiedades:
 * - generateEducationalResource: Genera un recurso educativo a partir de
 *   parámetros de entrada (prompt, formato, etc.).
 */
export class GenerationsServiceContainer {
  /** Genera un recurso educativo a partir de los parámetros de entrada. */
  generateEducationalResource = new GenerateEducationalResourceUseCase(
    assistantInstructionsService,
    generationRepository
  );
}
