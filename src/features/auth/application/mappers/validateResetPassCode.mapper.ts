import {
  ValidateResetPassCodeOutput,
  ValidateResetPassCodeResponseDto,
} from "../dto/validateResetPassCode.dto";

/**
 * Mapper que transforma una entidad interna en un DTO de respuesta para la
 * solicitud de recuperación de contraseña (`ValidateResetPassCodeResponseDto`).
 *
 * Este mapper se encarga de:
 * 1. Tomar la entidad resultante del dominio o repositorio (con `userId`).
 * 2. Construir un objeto plano con las propiedades esperadas por el DTO.
 * 3. Validar y parsear dicho objeto mediante Zod (`ValidateResetPassCodeResponseDto.parse`).
 *
 * De esta forma, se asegura que la respuesta cumpla con el contrato definido
 * por el DTO antes de ser enviada hacia el cliente.
 *
 * @param {{ userId: string }} entity - Entidad interna que contiene el identificador del usuario asociado a la solicitud de reset.
 * @returns {ValidateResetPassCodeOutput} - Objeto validado que cumple con la estructura esperada del DTO de respuesta.
 *
 * @throws {ZodError} - Si el objeto generado no cumple con el esquema definido en `ValidateResetPassCodeResponseDto`.
 *
 * @example
 * const response = toResetPassRequestResponseDto({ userId: "abc123" });
 * // ✅ response = { userId: "abc123" }
 */
export const toValidateResetPassCodeDto = (entity: {
  userId: string;
}): ValidateResetPassCodeOutput => {
  const json: ValidateResetPassCodeOutput = {
    userId: entity.userId,
  };
  return ValidateResetPassCodeResponseDto.parse(json);
};
