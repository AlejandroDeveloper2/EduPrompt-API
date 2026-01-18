import { TransactionContext } from "./TransactionContext.interface";

export interface ITransactionManager {
  /**
   * Ejecuta una función dentro de una transacción.
   * Si algo falla lanza error y hace rollback.
   */
  execute<T>(operation: (ctx?: TransactionContext) => Promise<T>): Promise<T>;
}
