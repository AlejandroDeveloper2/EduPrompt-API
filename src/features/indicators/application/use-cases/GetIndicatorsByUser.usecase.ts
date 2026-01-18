import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { Indicator } from "../../domain/entities";
import { IndicatorRepository } from "../../domain/repositories/IndicatorRespository.interface";

export class GetIndicatorsByUserUseCase {
  constructor(private readonly indicatorRepository: IndicatorRepository) {}
  /**
   * Recupera los indicadores asociados a un usuario dado.
   *
   * @param userId - El identificador único del usuario cuyos indicadores se solicitan.
   * @returns Una promesa que se resuelve con el Indicator perteneciente al usuario.
   * @throws {AppError} Cuando no existe un indicador para el userId proporcionado (ErrorMessages.INDICATOR_NOT_FOUND, estado 404).
   *
   * @example
   * const indicators = await service.getIndicatorsByUser('user-123');
   */
  async run(userId: string): Promise<Indicator> {
    const indicator = await this.indicatorRepository.getIndicatorsByUser(
      userId
    );
    if (!indicator)
      throw new AppError(
        ErrorMessages.INDICATOR_NOT_FOUND,
        404,
        `Indicador no encontrado para el usuario con Id: ${userId}`,
        true
      );

    return indicator;
  }
}
