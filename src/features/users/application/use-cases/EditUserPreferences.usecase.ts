import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

import { UserPreferencesInput } from "../../application/dto/user.dto";

export class EditUserPreferencesUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}
  /**
   * Actualiza las preferencias o configuraciones para un usuario específico.
   *
   * @param userId - El identificador único del usuario cuyas preferencias se actualizarán.
   * @param updatedPreferences - El nuevo valor actualizado de las preferencias del usuario.
   * @returns Una promesa que se resuelve cuando la operación se completa.
   * @throws {AppError} Si no se encuentra el usuario con el ID proporcionado.
   */
  async run(
    userId: string,
    updatedPreferences: UserPreferencesInput
  ): Promise<void> {
    const userById = await this.userRepository.findById(userId);
    if (!userById)
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        404,
        "User does not exists in the database",
        true
      );
    await this.userRepository.updateUserPreferences(userId, {
      ...userById.userPreferences,
      ...updatedPreferences,
    });
  }
}
