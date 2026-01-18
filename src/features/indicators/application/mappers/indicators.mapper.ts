import { Indicator } from "../../domain/entities";

import {
  IndicatorsOutput,
  IndicatorsOutputDto,
} from "../dto/getIndicatorsByUser.dto";

/**
 * Transforma una entidad Indicator en un objeto de respuesta seguro para el endpoint de Indicadores.
 *
 * Esta función toma una instancia de la entidad Indicator, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO IndicatorsOutputDto.
 *
 * @param entity Instancia de Indicator proveniente de la base de datos.
 * @returns Objeto validado de tipo IndicatorsOutput, listo para ser enviado como respuesta al cliente.
 */
export const toIndicatorOuputDto = (entity: Indicator): IndicatorsOutput => {
  const json = {
    generatedResources: entity.generatedResources,
    usedTokens: entity.usedTokens,
    lastGeneratedResource: entity.lastGeneratedResource,
    dowloadedResources: entity.dowloadedResources,
    savedResources: entity.savedResources,
  };

  return IndicatorsOutputDto.parse(json);
};
