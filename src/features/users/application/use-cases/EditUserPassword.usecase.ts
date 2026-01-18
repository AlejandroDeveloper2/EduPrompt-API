import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

export class EditUserPasswordUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}
  /**
   * Actualiza la contraseña de un usuario por su ID.
   *
   * Busca al usuario en el repositorio mediante el `userId` proporcionado. Si el usuario no existe,
   * lanza un `AppError` con código de estado 404. Si el usuario existe, hashea la nueva contraseña
   * utilizando 14 rondas de salt y actualiza la contraseña del usuario en el repositorio.
   *
   * @param userId - El identificador único del usuario cuya contraseña se actualizará.
   * @param updatedPassword - La nueva contraseña que se asignará al usuario.
   * @throws {AppError} Si el usuario no se encuentra en la base de datos.
   * @returns Una promesa que se resuelve cuando la contraseña ha sido actualizada.
   */
  async run(userId: string, updatedPassword: string): Promise<void> {
    const result = await this.userRepository.updateUserPassword(
      userId,
      updatedPassword
    );

    if (result === null)
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        404,
        "User does not exists in the database",
        true
      );
  }
}
