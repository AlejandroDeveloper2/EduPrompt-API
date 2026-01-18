import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { Indicator } from "../../domain/entities";
import { IndicatorRepository } from "../../domain/repositories/IndicatorRespository.interface";

import { UpdateIndicatorInput } from "../dto/updateIndicators.dto";

export class UpdateIndicatorsUseCase {
  constructor(private readonly indicatorRepository: IndicatorRepository) {}
  /**
   * Actualiza los indicadores de un usuario dado con los datos parciales proporcionados.
   *
   * Aplica los campos parciales proporcionados al Indicator existente para el usuario especificado.
   *
   * @param userId - El identificador único del usuario cuyos indicadores se actualizarán.
   * @param updateIndicatorInput - Objeto parcial de indicadores que contiene los campos a actualizar.
   * @returns Una promesa que se resuelve cuando la actualización se completa con éxito.
   * @throws {AppError} Cuando no existe un indicador para el userId proporcionado (ErrorMessages.INDICATOR_NOT_FOUND, estado 404).
   *
   * @example
   * await service.updateIndicators('user-123', { score: 42 });
   */
  async run(
    userId: string,
    updateIndicatorInput: UpdateIndicatorInput
  ): Promise<void> {
    const result = await this.indicatorRepository.updateIndicators(
      userId,
      updateIndicatorInput as Partial<Indicator>
    );
    if (result === null)
      throw new AppError(
        ErrorMessages.INDICATOR_NOT_FOUND,
        404,
        `Indicador no encontrado para el usuario con Id: ${userId}`,
        true
      );
  }
}
