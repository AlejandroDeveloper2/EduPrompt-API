import { TagOutput, TagOutputDto } from "../dto/findTags.dto";

import { Tag } from "../../domain/entities";

/**
 * Transforma una entidad Tag en un objeto de respuesta seguro para el endpoint de tags.
 *
 * Esta función toma una instancia de la entidad Tag, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO TagOutputDto.
 *
 * @param entity Instancia de Tag proveniente de la base de datos.
 * @returns Objeto validado de tipo TagOutput, listo para ser enviado como respuesta al cliente.
 */
export const toTagOutputDto = (entity: Tag): TagOutput => {
  const json = {
    tagId: entity.tagId,
    name: entity.name,
    type: entity.type,
    sync: entity.sync,
  };

  return TagOutputDto.parse(json);
};
