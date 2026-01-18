import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

/**
 * Entidad de dominio que representa indicadores de uso por usuario.
 * Agrupa métricas como recursos generados, tokens consumidos y actividad
 * sobre recursos guardados/descargados.
 */
export class Indicator {
  /**
   * Crea una instancia de Indicator.
   *
   * Valida que los conteos numéricos no sean negativos; en caso contrario
   * lanza un AppError con código 400.
   *
   * @param indicatorId Identificador único del indicador.
   * @param generatedResources Cantidad total de recursos generados.
   * @param usedTokens Tokens consumidos por el usuario.
   * @param lastGeneratedResource ID o referencia del último recurso generado; null si no existe.
   * @param dowloadedResources Cantidad de recursos descargados.
   * @param savedResources Cantidad de recursos guardados.
   * @param userId Identificador del usuario al que pertenecen los indicadores.
   */
  constructor(
    public readonly indicatorId: string,
    public generatedResources: number,
    public usedTokens: number,
    public lastGeneratedResource: string | null,
    public dowloadedResources: number,
    public savedResources: number,
    public readonly userId: string
  ) {
    if (
      generatedResources < 0 ||
      usedTokens < 0 ||
      dowloadedResources < 0 ||
      savedResources < 0
    )
      throw new AppError(
        ErrorMessages.VALIDATION_ERROR,
        400,
        "Property `generatedResources, usedTokens, dowloadedResources or savedResources` must be positive value",
        true
      );
  }
}
