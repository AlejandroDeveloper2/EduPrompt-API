import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { IndicatorRepository } from "../../../domain/repositories/IndicatorRespository.interface";
import { Indicator } from "@/features/indicators/domain/entities";

import { IndicatorModel, MongoIndicator } from "./Indicator.model";
import { TransactionContext } from "@/core/domain/ports/TransactionContext.interface";

/**
 * Convierte un documento de Mongo a objeto de dominio `Indicator`.
 *
 * @param mongoIndicator - Documento proveniente de MongoDB.
 * @returns Objeto `Indicator`.
 */
const mapIndicator = (mongoIndicator: MongoIndicator): Indicator => {
  const {
    _id,
    generatedResources,
    usedTokens,
    lastGeneratedResource,
    dowloadedResources,
    savedResources,
    userId,
  } = mongoIndicator;

  return new Indicator(
    _id.toString(),
    generatedResources,
    usedTokens,
    lastGeneratedResource,
    dowloadedResources,
    savedResources,
    userId
  );
};

/**
 * Implementación del repositorio usando Mongoose para persistir y recuperar entidades Indicator.
 *
 * Implementa IndicatorRepository y encapsula operaciones específicas de Mongoose (IndicatorModel).
 * Todos los errores de base de datos se normalizan y se relanzan como AppError con un INTERNAL_SERVER_ERROR 500.
 *
 * Responsabilidades:
 * - Consultar indicadores para un usuario dado.
 * - Actualizar indicadores almacenados para un usuario dado.
 *
 * Nota: Los objetos de dominio devueltos se mapean mediante mapIndicator antes de ser retornados a los llamadores.
 */
export class IndicatorMongoRepository implements IndicatorRepository {
  /**
   * Recupera el documento de indicadores para un usuario dado.
   *
   * Ejecuta una consulta Mongoose findOne usando el userId proporcionado y mapea el documento
   * resultante de Mongoose al tipo de dominio Indicator.
   *
   * @param userId - El identificador único del usuario cuyos indicadores deben recuperarse.
   * @returns Una promesa que se resuelve con el objeto Indicator mapeado si se encuentra, o null si no existe documento para el usuario.
   *
   * @throws {AppError} Cuando ocurre un error en la base de datos; el error se lanza con INTERNAL_SERVER_ERROR (500).
   *
   * @example
   * const indicators = await repository.getIndicatorsByUser('user-123');
   * if (indicators === null) {
   *   // manejar indicadores ausentes
   * }
   */
  async getIndicatorsByUser(userId: string): Promise<Indicator | null> {
    try {
      const indicator = await IndicatorModel.findOne({ userId });

      if (!indicator) return null;

      return mapIndicator(indicator.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `Ocurrió un error al obtener los indicadores del usuario: ${error}`,
        false
      );
    }
  }

  /**
   * Crea un documento de indicadores por defecto para el usuario especificado.
   *
   * Si se proporciona `ctx` y contiene una `session`, la creación se ejecutará dentro
   * de esa sesión de MongoDB para participar en una transacción; en caso contrario
   * el documento se crea fuera de sesión.
   *
   * @param userId - ID del usuario para el cual crear indicadores.
   * @param ctx - Contexto de transacción opcional. Si existe y contiene `session`, se usará en la llamada a Mongoose.
   */
  async createIndicators(
    userId: string,
    ctx?: TransactionContext
  ): Promise<void> {
    try {
      if (ctx && "session" in ctx) {
        await IndicatorModel.create([{ userId }], {
          session: ctx.session,
        });
        return;
      }
      await IndicatorModel.create({ userId });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `Ocurrió un error al registrar los indicadores del usuario: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza los indicadores para un usuario dado.
   *
   * Realiza un findOneAndUpdate de Mongoose usando el userId proporcionado y el payload parcial de Indicator.
   * Si no se encuentra un documento existente para el usuario, el método devuelve null. Las actualizaciones exitosas no devuelven un valor.
   *
   * @param userId - El identificador único del usuario cuyos indicadores deben actualizarse.
   * @param updatedIndicators - Un objeto parcial de Indicator que contiene los campos a actualizar.
   * @returns Una promesa que se resuelve con void en caso de éxito o null si no se encontró ningún documento para actualizar.
   *
   * @throws {AppError} Cuando ocurre un error en la base de datos; el error se lanza con INTERNAL_SERVER_ERROR (500).
   *
   * @example
   * await repository.updateIndicators('user-123', { completionRate: 0.85 });
   */

  async updateIndicators(
    userId: string,
    updatedIndicators: Partial<Indicator>
  ): Promise<void | null> {
    try {
      const updatedIndicator = await IndicatorModel.findOneAndUpdate(
        { userId },
        { ...updatedIndicators }
      );
      if (!updatedIndicator) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `Ocurrió un error al actualizar los indicadores del usuario: ${error}`,
        false
      );
    }
  }
}
