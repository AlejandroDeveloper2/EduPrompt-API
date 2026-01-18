import { Generation } from "../../domain/entities";

import {
  GenerationOutput,
  GenerationOutputDto,
} from "../dto/generateEducationalResource.dto";

/**
 * Transforma una entidad AssitantResponse en un objeto de respuesta seguro para el endpoint de generation.
 *
 * Esta función toma una instancia de la entidad GenerationOutput, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO GenerationOutputDto.
 *
 * @param entity Instancia de Generation proveniente del repositorio de open ia.
 * @returns Objeto validado de tipo GenerationOutput, listo para ser enviado como respuesta al cliente.
 */
export const toGenerationOutputDto = (entity: Generation): GenerationOutput => {
  const json = {
    generationDate: entity.generationDate,
    result: entity.result,
  };

  return GenerationOutputDto.parse(json);
};
