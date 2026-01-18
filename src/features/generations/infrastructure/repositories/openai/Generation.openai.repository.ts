import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { GenerationRepositoryType } from "../../../domain/repositories/GenerationRepository.interface";
import { Generation } from "../../../domain/entities";

import { openai } from "./Openai.model";

/**
 * Repositorio de generación de recursos utilizando los servicios de OpenAI.
 *
 * Implementa la interfaz GenerationRepositoryType para orquestar las llamadas a
 * modelos de lenguaje (texto) e imágenes, encapsulando errores y normalizando
 * la respuesta de la capa de persistencia.
 */
export class GenerationOpenAIRepository implements GenerationRepositoryType {
  /**
   * Genera un recurso textual a partir de instrucciones del asistente y un prompt del usuario.
   *
   * Internamente invoca el endpoint de OpenAI para respuestas de texto y retorna
   * el contenido y la fecha de generación en un formato unificado.
   *
   * @param {string} assistantInstructions - Instrucciones del asistente que guían el estilo y contenido.
   * @param {string} userPrompt - Prompt original del usuario a transformar en recurso textual.
   * @returns {Promise<Generation>} Objeto con el texto generado y la fecha de generación.
   * @throws {AppError} Si ocurre un error al procesar la generación de texto.
   */
  async generateTextResource(
    assistantInstructions: string,
    userPrompt: string
  ): Promise<Generation> {
    try {
      const { output_text, created_at } = await openai.responses.create({
        model: "gpt-4o",
        instructions: assistantInstructions,
        input: userPrompt,
      });
      return {
        result: output_text,
        generationDate: new Date(created_at),
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while proccesing generation: ${error}`,
        false
      );
    }
  }

  /**
   * Genera un recurso de imagen a partir de un prompt ya procesado.
   *
   * Utiliza el modelo de imágenes de OpenAI para obtener una imagen codificada
   * en Base64 y la fecha de generación. Si la API no devuelve datos válidos,
   * retorna null.
   *
   * @param {string} processedPrompt - Prompt visual listo para la generación de imágenes.
   * @returns {Promise<Generation | null>} Objeto con la imagen en Base64 y la fecha de generación, o null si no hay datos.
   * @throws {AppError} Si ocurre un error al procesar la generación de imagen.
   */
  async generateImageResource(
    processedPrompt: string
  ): Promise<Generation | null> {
    try {
      const { data } = await openai.images.generate({
        model: "gpt-image-1",
        prompt: processedPrompt,
        n: 1,
        size: "1024x1024",
      });

      if (!data || !data[0] || !data[0].b64_json) return null;

      return {
        result: data[0].b64_json,
        generationDate: new Date(),
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while proccesing image generation: ${error}`,
        false
      );
    }
  }
}
