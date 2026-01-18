import { connect, ConnectOptions } from "mongoose";

import { IDBConnection } from "@/core/domain/ports/IDBConnection.interface";

import { config } from "@/config/enviromentVariables";
import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

/**
 * Adaptador que gestiona una conexión a MongoDB usando Mongoose.
 *
 * Proporciona una implementación concreta de la interfaz IDBConnection para conectar
 * a una instancia de MongoDB. Encapsula la lógica de conexión y convierte fallos
 * en AppError estandarizados.
 *
 * Responsabilidades:
 * - Usar la URI de MongoDB configurada para establecer la conexión.
 * - Registrar las conexiones exitosas.
 * - Lanzar un AppError con un mensaje y código de estado consistentes cuando la conexión falla.
 *
 * @implements {IDBConnection}
 */
export class MongoDBConnectionAdapter implements IDBConnection {
  /**
   * Establece la conexión a la base de datos MongoDB.
   *
   * Intenta conectar usando mongoose.connect con la URI provista por la configuración.
   * En caso de éxito, registra un mensaje de confirmación. En caso de fallo, lanza un AppError
   * con un mensaje amigable, estado HTTP 500 e información diagnóstica del error original.
   *
   * @async
   * @returns {Promise<void>} Se resuelve cuando la conexión se establece correctamente.
   * @throws {AppError} Si la llamada a mongoose.connect falla.
   */
  async connectToDatabase(): Promise<void> {
    try {
      await connect(config.LOCAL_MONGO_DB_URI, {} as ConnectOptions);
      console.log("¡✅ Conexión a la base de datos realizada con éxito!");
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.DATABASE_CONNECTION_ERROR,
        500,
        `❌ Ocurrió un error al conectar con la base de datos: ${error}`,
        true
      );
    }
  }
}
