import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { ApiKey } from "../../../domain/entities";
import { ApiKeyRepositoryType } from "../../../domain/repositories/ApiKeyRepository.interface";
import { ApiKeyScope, CreateKey } from "../../../domain/types";

import { ApiKeyModel, MongoApiKey } from "./ApiKey.model";

/**
 * Mapea un objeto de tipo `MongoApiKey` a un objeto de tipo `ApiKey`.
 *
 *
 * @param mongoApiKey - El objeto de usuario proveniente de la base de datos MongoDB.
 * @returns Un nuevo objeto de tipo `ApiKey` con las propiedades mapeadas.
 */
const mapApiKey = (mongoApiKey: MongoApiKey): ApiKey => {
  const {
    keyId,
    name,
    secretHash,
    scopes,
    active,
    expiresAt,
    createdAt,
    lastUsedAt,
  } = mongoApiKey;
  return new ApiKey(
    keyId,
    name,
    secretHash,
    scopes as ApiKeyScope[],
    active,
    createdAt,
    expiresAt,
    lastUsedAt
  );
};

/**
 * Repositorio de API Keys para MongoDB.
 *
 * Implementa las operaciones CRUD básicas y de mantenimiento
 * sobre las API Keys almacenadas en la base de datos.
 *
 * @implements {ApiKeyRepositoryType}
 */
export class ApiKeyMongoRepository implements ApiKeyRepositoryType {
  /**
   * Crea una nueva API Key en la base de datos.
   *
   * @param data - Objeto con los datos de la API Key (excepto `createdAt` y `lastUsedAt`, que se generan automáticamente).
   * @returns La API Key creada como entidad de dominio.
   *
   * @throws {AppError} - Si ocurre un error al guardar en la base de datos.
   */
  async create(data: CreateKey): Promise<ApiKey> {
    try {
      const doc = await ApiKeyModel.create({
        ...data,
        createdAt: new Date(),
        lastUsedAt: null,
      });

      return mapApiKey(doc.toObject());
    } catch (error: unknown) {
      console.log(error);
      throw new AppError(ErrorMessages.INTERNAL_SERVER_ERROR, 500, "", false);
    }
  }
  /**
   * Busca una API Key en la base de datos por su `keyId`.
   *
   * @param keyId - Identificador único de la API Key.
   * @returns La API Key encontrada o `null` si no existe.
   *
   * @throws {AppError} - Si ocurre un error en la consulta a la base de datos.
   */
  async findById(keyId: string): Promise<ApiKey | null> {
    try {
      const doc = await ApiKeyModel.findOne({ keyId });

      if (!doc) return null;

      return mapApiKey(doc.toObject());
    } catch (error: unknown) {
      console.log(error);
      throw new AppError(ErrorMessages.INTERNAL_SERVER_ERROR, 500, "", false);
    }
  }
  /**
   * Actualiza la fecha de último uso (`lastUsedAt`) de una API Key.
   *
   * @param keyId - Identificador único de la API Key.
   * @param at - Fecha en la que se usó por última vez la API Key.
   *
   * @throws {AppError} - Si ocurre un error al actualizar la base de datos.
   */
  async setLastUsed(keyId: string, at: Date): Promise<void> {
    try {
      await ApiKeyModel.updateOne({ keyId }, { lastUsedAt: at });
    } catch (error: unknown) {
      console.log(error);
      throw new AppError(ErrorMessages.INTERNAL_SERVER_ERROR, 500, "", false);
    }
  }
  /**
   * Desactiva una API Key (cambia su estado `active` a `false`).
   *
   * @param keyId - Identificador único de la API Key.
   *
   * @throws {AppError} - Si ocurre un error al actualizar la base de datos.
   */
  async deactivate(keyId: string): Promise<void> {
    try {
      await ApiKeyModel.updateOne({ keyId }, { active: false });
    } catch (error: unknown) {
      console.log(error);
      throw new AppError(ErrorMessages.INTERNAL_SERVER_ERROR, 500, "", false);
    }
  }
}
