import crypto from "node:crypto";
import { hash } from "bcryptjs";

import { ApiKeyRepositoryType } from "../../domain/repositories/ApiKeyRepository.interface";

import { CreateApiKeyInput } from "../dto/apiKey.dto";

export class CreateApiKeyUseCase {
  constructor(private apiKeyRepository: ApiKeyRepositoryType) {}

  /**
   * Genera un identificador único para una API Key.
   *
   * @param prefix - Prefijo opcional para el `keyId` (por defecto `"ak_live"`).
   * @returns Un string único con el formato: `<prefix>_<randomHex>`.
   *
   * @example
   * ```ts
   * const keyId = service.getRandomId(); // ak_live_ab12cd34ef...
   * ```
   */
  private getRandomId(prefix = "ak_live"): string {
    return `${prefix}_${crypto.randomBytes(16).toString("hex")}`;
  }

  /**
   * Genera un secreto aleatorio y seguro para la API Key.
   *
   * El secreto se devuelve en formato Base64 URL-safe.
   *
   * @returns Un string seguro de 32 bytes en formato Base64 URL-safe.
   */
  private getRandomSecret(): string {
    return crypto.randomBytes(32).toString("base64url"); // URL-safe
  }
  /**
   * Crea una nueva API Key y la almacena en el repositorio.
   *
   * - Genera un `keyId` único.
   * - Genera un `secret` aleatorio y lo hashea antes de guardarlo.
   * - Persiste la API Key con metadatos como scopes, expiración y estado.
   * - Retorna el token completo (`keyId.secret`) que debe mostrarse **una sola vez**.
   *
   * @param input - Datos necesarios para crear la API Key (`name`, `scopes`, `expiresAt` opcional).
   * @returns Un objeto con el `token` completo y el `keyId`.
   *
   * @example
   * ```ts
   * const { token, keyId } = await service.createApiKey({
   *   name: "Mi integración",
   *   scopes: ["READ_USERS", "WRITE_USERS"],
   * });
   *
   * console.log(token); // ak_live_1234abcd.secretXYZ
   * ```
   */
  async run(
    input: CreateApiKeyInput
  ): Promise<{ token: string; keyId: string }> {
    const keyId = this.getRandomId();
    const secret = this.getRandomSecret();
    const secretHash = await hash(secret, 12);

    await this.apiKeyRepository.create({
      keyId,
      name: input.name,
      secretHash,
      scopes: input.scopes,
      active: true,
      expiresAt: input.expiresAt ?? null,
    });

    return { token: `${keyId}.${secret}`, keyId };
  }
}
