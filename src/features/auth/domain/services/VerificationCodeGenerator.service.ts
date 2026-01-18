/**
 * Servicio para generar códigos de verificación alfanuméricos cortos.
 *
 * Produce una cadena aleatoria compuesta por letras mayúsculas, letras minúsculas y dígitos.
 * El código generado tiene una longitud fija definida por la constante CODE_LENGTH (por defecto: 4).
 *
 * Nota: Esta implementación usa Math.random() y no es adecuada para casos criptográficos o
 * de alta seguridad. Para escenarios sensibles en seguridad, sustituya el RNG por una
 * fuente criptográficamente segura (p. ej., crypto.getRandomValues).
 *
 * @example
 * const svc = new VerificationCodeGeneratorService();
 * const code = svc.generate(); // p. ej. "aB3d"
 *
 * @remarks
 * - Los caracteres disponibles se definen en la cadena `characters`.
 * - `CODE_LENGTH` controla el número de caracteres en cada código generado.
 *
 * @returns {string} Un código de verificación generado aleatoriamente de longitud CODE_LENGTH.
 */
export class VerificationCodeGeneratorService {
  private readonly characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  private readonly CODE_LENGTH = 4;

  generate(): string {
    let verificationCode = "";
    for (let i = 0; i < this.CODE_LENGTH; i++) {
      const randomIndex: number = Math.floor(
        Math.random() * this.characters.length
      );
      const codeChar = this.characters[randomIndex];
      verificationCode += codeChar;
    }
    return verificationCode;
  }
}
