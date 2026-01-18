import { PromptOutput, PromptOutputDto } from "../dto/findPromptsByUser.dto";

import { Prompt } from "../../domain/entities";

/**
 * Transforma una entidad Prompt en un objeto de respuesta seguro para el endpoint de prompt.
 *
 * Esta función toma una instancia de la entidad PromptOutput, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO PromptOutputDto.
 *
 * @param entity Instancia de Prompt proveniente de la base de datos.
 * @returns Objeto validado de tipo PromptOutput, listo para ser enviado como respuesta al cliente.
 */
export const toPromptOutputDto = (entity: Prompt): PromptOutput => {
  const json = {
    promptId: entity.promptId,
    promptTitle: entity.promptTitle,
    promptText: entity.promptText,
    tag: entity.tag,
  };

  return PromptOutputDto.parse(json);
};
