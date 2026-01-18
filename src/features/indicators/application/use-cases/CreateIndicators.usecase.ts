import { TransactionContext } from "@/core/domain/ports/TransactionContext.interface";

import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { IndicatorRepository } from "../../domain/repositories/IndicatorRespository.interface";

/**
 * Caso de uso responsable de crear indicadores para un usuario dado.
 *
 * Esta clase coordina con un IndicatorRepository para:
 * - Verificar si el usuario especificado ya tiene indicadores.
 * - Si no existen, crear los indicadores (opcionalmente dentro de una transacción).
 *
 * @remarks
 * - Si el usuario ya tiene indicadores, este caso de uso lanza un AppError
 *   con código 409 indicando que el recurso ya existe.
 * - La operación de creación puede ejecutarse dentro de un TransactionContext
 *   opcional para habilitar comportamiento transaccional en la capa de repositorio.
 *
 * @example
 * const useCase = new CreateIndicatorsUseCase(indicatorRepository);
 * await useCase.run('user-id-123', transactionContext);
 */

export class CreateIndicatorsUseCase {
  constructor(private readonly indicatorRepository: IndicatorRepository) {}

  /**
   * Crea un nuevo CreateIndicatorsUseCase.
   *
   * @param indicatorRepository - Repositorio usado para consultar y crear indicadores.
   */

  /**
   * Ejecuta el caso de uso para asegurar que existan indicadores para el usuario especificado.
   *
   * @param userId - Identificador del usuario para el que crear indicadores.
   * @param ctx - TransactionContext opcional para ejecutar la creación dentro de una transacción.
   * @throws {AppError} Si el usuario ya tiene indicadores registrados (HTTP 409).
   * @returns Una promesa que se resuelve cuando la creación de indicadores se completa correctamente.
   */
  async run(userId: string, ctx?: TransactionContext): Promise<void> {
    const indicator = await this.indicatorRepository.getIndicatorsByUser(
      userId
    );
    if (indicator)
      throw new AppError(
        ErrorMessages.USER_INDICATOR_ALREADY_CREATED,
        409,
        "Este usuario ya tiene indicadores registrados",
        true
      );

    await this.indicatorRepository.createIndicators(userId, ctx);
  }
}
