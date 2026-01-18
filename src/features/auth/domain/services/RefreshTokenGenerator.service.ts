import crypto from "crypto";

/**
 * Servicio que genera tokens de actualización (refresh tokens) criptográficamente seguros
 * y produce hashes SHA-256 para un almacenamiento seguro.
 *
 * El generador crea 64 bytes aleatorios y los devuelve como una cadena codificada en hexadecimal.
 * El hasher calcula un digest SHA-256 codificado en hexadecimal de un token dado. Almacene solo
 * el valor hasheado en el almacenamiento persistente y mantenga el token en bruto de forma
 * transitoria (enviado al cliente).
 *
 * @public
 * @remarks
 * - generate() devuelve una cadena hex que representa 64 bytes aleatorios (128 caracteres hex).
 * - hash(token) devuelve un digest SHA-256 codificado en hex (64 caracteres hex).
 *
 * @example
 * const svc = new RefreshTokenGeneratorService();
 * const token = svc.generate();       // token aleatorio seguro (128 caracteres hex)
 * const hashed = svc.hash(token);     // almacene este valor hasheado (64 caracteres hex)
 *
 * @throws Puede propagar errores del módulo crypto de Node.js si no está disponible o está mal configurado.
 */

export class RefreshTokenGeneratorService {
  /**
   * Genera un token de actualización criptográficamente seguro.
   *
   * @returns Una cadena codificada en hex de 64 bytes aleatorios (128 caracteres hex). Apta para enviarse al cliente como refresh token.
   *
   * @throws Si la implementación crypto subyacente falla.
   */
  generate(): string {
    return crypto.randomBytes(64).toString("hex");
  }
  /**
   * Calcula el hash SHA-256 del token proporcionado.
   *
   * @param token - El token de actualización en bruto a hashear. Debe coincidir exactamente con el token generado o recibido previamente.
   * @returns Un digest SHA-256 codificado en hex (64 caracteres hex), adecuado para almacenamiento y comparación.
   *
   * @throws Si no se proporciona token o si la implementación crypto subyacente falla.
   */
  hash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Compara un valor en texto plano con un valor hasheado almacenado,
   * hasheando el valor en texto plano y comprobando la igualdad.
   *
   * @param raw - El valor en texto plano a hashear y comparar (por ejemplo, un token o contraseña).
   * @param hashed - El valor hasheado almacenado con el que comparar.
   * @returns `true` si `this.hash(raw)` es estrictamente igual a `hashed`; de lo contrario `false`.
   *
   * @remarks
   * La comparación actual realiza una comprobación directa de igualdad entre cadenas hasheadas.
   * Para datos sensibles, considere usar una comparación en tiempo constante para mitigar ataques por temporización.
   */
  compare(raw: string, hashed: string): boolean {
    return this.hash(raw) === hashed;
  }
}
