import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

export class EditUserEmailUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}
  /**
   * Actualiza la dirección de correo electrónico de un usuario identificado por su ID de usuario.
   *
   * @param userId - El identificador único del usuario cuya dirección de correo electrónico se va a actualizar.
   * @param updatedEmail - La nueva dirección de correo electrónico que se asignará al usuario.
   * @throws {AppError} Si el usuario no existe en la base de datos.
   * @returns Una promesa que se resuelve cuando el correo electrónico ha sido actualizado exitosamente.
   */
  async run(userId: string, updatedEmail: string): Promise<void> {
    const result = await this.userRepository.updateEmail(userId, updatedEmail);
    if (result === null)
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        404,
        "User does not exists in the database",
        true
      );
  }
}
