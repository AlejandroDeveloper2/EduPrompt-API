import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

import { EditUserAccountTypeInput } from "../dto/editUserAccountType.dto";

export class EditUserAccountTypeUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}
  /**
   * Actualiza el tipo de cuenta de un usuario a premium o estándar.
   *
   * @param userId - El identificador único del usuario cuyo tipo de cuenta se va a actualizar.
   * @param editUserAccountTypeInput - Objeto con un booleano que indica si el usuario debe establecerse como usuario premium (`true`) o no (`false`).
   * @returns Una promesa que se resuelve cuando el tipo de cuenta ha sido actualizado.
   * @throws {AppError} Si no se encuentra el usuario con el ID especificado.
   */
  async run(
    userId: string,
    editUserAccountTypeInput: EditUserAccountTypeInput
  ): Promise<void> {
    const result = await this.userRepository.updateAccountType(
      userId,
      editUserAccountTypeInput.isPremiumUser
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
