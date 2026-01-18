import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

import { UpdateUsernameInput } from "../dto/updateUsername.dto";
import { ValidateUsernameAvailabilityUseCase } from "./ValidateUsernameAvailability.usecase";

export class EditUsernameUseCase {
  private readonly validateUsernameAvailabilityUseCase: ValidateUsernameAvailabilityUseCase;

  constructor(private readonly userRepository: UserRepositoryType) {
    this.validateUsernameAvailabilityUseCase =
      new ValidateUsernameAvailabilityUseCase(userRepository);
  }
  /**
   * Actualiza el nombre de usuario de un usuario por su ID.
   *
   * @param userId - El identificador único del usuario cuyo nombre de usuario se va a actualizar.
   * @param updateUsernameInput - Objeto con el nuevo nombre de usuario que se asignará al usuario.
   * @returns Una promesa que se resuelve cuando el nombre de usuario ha sido actualizado exitosamente.
   * @throws {AppError} Si no se encuentra el usuario.
   * @throws {AppError} Si el nuevo nombre de usuario ya está en uso por otro usuario.
   */
  async run(
    userId: string,
    updateUsernameInput: UpdateUsernameInput
  ): Promise<void> {
    const { userName } = updateUsernameInput;

    await this.validateUsernameAvailabilityUseCase.run(userName, userId);

    const result = await this.userRepository.updateUsername(userId, userName);

    if (result === null)
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        404,
        "User does not exists in the database",
        true
      );
  }
}
