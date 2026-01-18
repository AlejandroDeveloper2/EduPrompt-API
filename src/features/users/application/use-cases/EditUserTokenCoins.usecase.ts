import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

import { EditUserTokenCoinsInput } from "../dto/editUserTokenCoins.dto";

export class EditUserTokenCoinsUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}
  /**
   * Actualiza el saldo de token coins para un usuario específico.
   *
   * @param userId - El identificador único del usuario cuyo saldo de token coins se actualizará.
   * @param tokenCoins - El nuevo valor de token coins que se asignará al usuario.
   * @returns Una promesa que se resuelve cuando la operación se completa.
   * @throws {AppError} Si no se encuentra el usuario con el ID proporcionado.
   */
  async run(
    userId: string,
    editUserTokenCoinsInput: EditUserTokenCoinsInput
  ): Promise<void> {
    const result = await this.userRepository.updateTokenCoins(
      userId,
      editUserTokenCoinsInput.tokenCoins
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
