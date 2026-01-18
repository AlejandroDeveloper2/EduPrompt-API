import mongoose from "mongoose";

import { ITransactionManager } from "@/core/domain/ports/ITransactionManager.interface";

/**
 * Adaptador que implementa ITransactionManager usando transacciones de Mongoose.
 *
 * Inicia una nueva ClientSession y ejecuta una operación proporcionada dentro de
 * session.withTransaction, gestionando el ciclo de vida de la sesión (inicio, commit/abort, end).
 *
 * Responsabilidades:
 * - Crear e iniciar una sesión de Mongoose.
 * - Ejecutar la operación suministrada dentro de una transacción usando la sesión.
 * - Asegurar que la sesión termine en un bloque finally independientemente del éxito o fallo.
 * - Registrar y relanzar errores encontrados durante la transacción.
 *
 * @remarks
 * La operación proporcionada debe usar la sesión dada para todas las acciones de base de datos que deban
 * formar parte de la transacción (por ejemplo, pasar { session } a las llamadas de modelos de Mongoose).
 * El adaptador devuelve el valor que la operación resuelva después de completar la transacción.
 *
 * @see https://mongoosejs.com/docs/transactions.html
 */
export class MongoTransactionManagerAdapter implements ITransactionManager {
  /**
   * Ejecuta una operación asincrónica dentro de una transacción de MongoDB.
   *
   * @typeParam T - El tipo de retorno de la operación a ejecutar dentro de la transacción.
   * @param operation - Una función que recibe un objeto que contiene una ClientSession de Mongoose
   *                    y realiza el trabajo transaccional, devolviendo una Promise<T>.
   *                    Todas las operaciones de base de datos que deban formar parte de la transacción deben
   *                    usar la sesión proporcionada.
   * @returns Una Promise que se resuelve con el valor devuelto por la operación una vez que la transacción
   *          haya sido confirmada.
   * @throws {Error} Lanza un Error si la transacción falla o la operación lanza una excepción. El error original
   *                 se registra en la consola y se relanza con el prefijo "error: ".
   *
   * @example
   * await transactionManager.execute(async ({ session }) => {
   *   await ModelA.create([docA], { session });
   *   await ModelB.updateOne(filter, update, { session });
   *   return someResult;
   * });
   */
  async execute<T>(
    operation: (ctx: { session: mongoose.ClientSession }) => Promise<T>
  ): Promise<T> {
    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        return await operation({ session });
      });

      return result;
    } catch (error) {
      throw new Error("Transaction error: " + error);
    } finally {
      session.endSession();
    }
  }
}
