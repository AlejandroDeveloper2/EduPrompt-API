import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";
import { AccountStatus } from "../../domain/types";

export class EditUserAccountStatusUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}
  /**
   * Actualiza el estado de la cuenta de un usuario por su identificador único.
   *
   * @param userId - El identificador único del usuario cuyo estado de cuenta se va a actualizar.
   * @param accountStatus - El nuevo estado de cuenta que se asignará al usuario. Puede ser "active" o "inactive".
   * @returns Una promesa que se resuelve cuando el estado de la cuenta ha sido actualizado.
   * @throws {AppError} Si no se encuentra el usuario con el ID especificado.
   */
  async run(userId: string, accountStatus: AccountStatus): Promise<void> {
    const result = await this.userRepository.updateAccountStatus(
      userId,
      accountStatus
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
