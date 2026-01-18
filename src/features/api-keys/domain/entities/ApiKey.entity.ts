import { ApiKeyScope } from "../types";

/**
 * Representa una clave de API utilizada para autenticar e identificar
 * integraciones externas (por ejemplo, Backoffice, Mobile App, servicios).
 *
 * Contiene metadatos, permisos (scopes), estado y marcas de tiempo
 * relevantes para su ciclo de vida. El secreto real NO se almacena, solo
 * un hash seguro del mismo.
 */
export class ApiKey {
  /**
   * Crea una instancia inmutable de ApiKey.
   *
   * @param keyId Identificador único de la API Key (no el secreto). Inmutable.
   * @param name Nombre/etiqueta para identificar la clave (ej. "Backoffice", "MobileApp").
   * @param secretHash Hash del secreto (ej. bcrypt/argon2). Nunca almacenar el secreto en texto plano.
   * @param scopes Lista de permisos (alcances) concedidos a la clave.
   * @param active Indica si la clave está habilitada para su uso.
   * @param createdAt Fecha de creación de la clave.
   * @param expiresAt Fecha de expiración; null/undefined si no expira.
   * @param lastUsedAt Última fecha en la que se usó la clave; null/undefined si nunca se ha usado.
   */
  constructor(
    public readonly keyId: string,
    public name: string, // etiqueta para identificar (ej. "Backoffice", "MobileApp")
    public secretHash: string, // hash del secret (bcrypt/argon2)
    public scopes: ApiKeyScope[], // permisos
    public active: boolean,
    public createdAt: Date,
    public expiresAt?: Date | null,
    public lastUsedAt?: Date | null
  ) {}
}
