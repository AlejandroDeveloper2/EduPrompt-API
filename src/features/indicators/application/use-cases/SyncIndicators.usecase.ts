import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { IndicatorRepository } from "../../domain/repositories/IndicatorRespository.interface";

import { SyncIndicatorsInput } from "../dto/syncIndicators.dto";

/**
 * Caso de uso responsable de sincronizar indicadores para un usuario dado.
 *
 * @remarks
 * Delegar la lógica de persistencia y actualización a un IndicatorRepository. Si el repositorio
 * indica que el(los) indicador(es) objetivo no se puede(n) encontrar (el repositorio devuelve `null`),
 * este caso de uso lanzará un AppError con estado 404 indicando que no se encontró el indicador
 * para el id de usuario proporcionado.
 *
 * @param indicatorRepository - Repositorio utilizado para actualizar y persistir indicadores.
 */
export class SyncIndicatorsUseCase {
  constructor(private readonly indicatorRepository: IndicatorRepository) {}

  /**
   * Ejecuta la sincronización de indicadores para un usuario.
   *
   * @param userId - El id del usuario cuyos indicadores deben sincronizarse.
   * @param syncIndicatorsInput - El payload de entrada que contiene los datos de los indicadores a sincronizar.
   * @returns Una Promise que se resuelve cuando la sincronización se completa correctamente.
   * @throws {AppError} Lanzado cuando no se encuentra ningún indicador para el usuario dado (usa ErrorMessages.INDICATOR_NOT_FOUND, HTTP 404).
   */

  async run(
    userId: string,
    syncIndicatorsInput: SyncIndicatorsInput
  ): Promise<void> {
    const result = await this.indicatorRepository.updateIndicators(
      userId,
      syncIndicatorsInput
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
