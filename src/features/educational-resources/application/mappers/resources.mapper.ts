import { EducationalResource } from "../../domain/entities";

import {
  EducationalResourceOutput,
  EducationalResourceOutputDto,
} from "../dto/findResourcesByUser.dto";

/**
 * Transforma una entidad EducationalResource en un objeto de respuesta seguro para el endpoint de recurso educativo.
 *
 * Esta función toma una instancia de la entidad EducationalResource, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO EducationalResourceOutputDto.
 *
 * @param entity Instancia de EducationalResource proveniente de la base de datos.
 * @returns Objeto validado de tipo EducationalResourceOutput, listo para ser enviado como respuesta al cliente.
 */
export const toResourceOutputDto = (
  entity: EducationalResource
): EducationalResourceOutput => {
  const json = {
    resourceId: entity.resourceId,
    title: entity.title,
    content: entity.content,
    format: entity.format,
    formatKey: entity.formatKey,
    groupTag: entity.groupTag,
    creationDate: entity.creationDate,
  };

  return EducationalResourceOutputDto.parse(json);
};
