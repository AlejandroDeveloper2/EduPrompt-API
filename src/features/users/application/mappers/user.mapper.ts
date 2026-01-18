import { User } from "../../domain/entities";

import { UserOutput, UserResponseDto } from "../dto/user.dto";

/**
 * Transforma una entidad User en un objeto de respuesta seguro para el endpoint de usuario.
 *
 * Esta función toma una instancia de la entidad User, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO UserResponseDto.
 *
 * @param entity Instancia de User proveniente de la base de datos.
 * @returns Objeto validado de tipo UserOutput, listo para ser enviado como respuesta al cliente.
 */
export const toUserResponseDto = (entity: User): UserOutput => {
  const json = {
    userName: entity.userName,
    email: entity.email,
    tokenCoins: entity.tokenCoins,
    isPremiumUser: entity.isPremiumUser,
    userPreferences: entity.userPreferences,
  };

  return UserResponseDto.parse(json);
};
