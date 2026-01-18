import { compare } from "bcryptjs";

import { ApiKeyRepositoryType } from "../../domain/repositories/ApiKeyRepository.interface";

export class VerifySecretUseCase {
  constructor(private apiKeyRepository: ApiKeyRepositoryType) {}
  /**
   * Verifica que un `secret` corresponda al `keyId` dado.
   *
   * - Comprueba que la API Key exista y esté activa.
   * - Valida que no haya expirado.
   * - Compara el `secret` recibido contra el hash almacenado.
   *
   * @param keyId - Identificador único de la API Key.
   * @param secret - Secreto enviado en la request.
   * @returns `true` si el secreto es válido, de lo contrario `false`.
   *
   * @example
   * ```ts
   * const isValid = await service.verifySecret(keyId, "secretXYZ");
   * if (!isValid) throw new Error("API Key inválida");
   * ```
   */
  async run(keyId: string, secret: string): Promise<boolean> {
    const apiKey = await this.apiKeyRepository.findById(keyId);

    if (!apiKey || !apiKey.active) return false;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return false;

    return compare(secret, apiKey.secretHash);
  }
}
