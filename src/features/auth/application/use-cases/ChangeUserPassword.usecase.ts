import { compare, hash } from "bcryptjs";

import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UsersFeature } from "@/features/users";

import { ChangeUserPasswordInput } from "../dto/changeUserPassword.dto";

export class ChangeUserPasswordUseCase {
  constructor() {}
  /**
   * Cambia la contraseña de un usuario validando la contraseña actual.
   *
   * @param userId - Identificador único del usuario.
   * @param changeUserPasswordInput - Objeto con contraseña actual y nueva.
   * @throws {AppError} - Si el usuario no existe o la contraseña actual no coincide.
   */
  async run(
    userId: string,
    changeUserPasswordInput: ChangeUserPasswordInput
  ): Promise<void> {
    //Validamos si el userId pertenece a un usuario existente
    const userById = await UsersFeature.service.findUserProfile.run(userId);

    const isCorrectPassword: boolean = await compare(
      changeUserPasswordInput.currentPassword,
      userById.password
    );

    if (!isCorrectPassword)
      throw new AppError(
        ErrorMessages.INCORRECT_PASSWORD,
        401,
        "User password is incorrect",
        true
      );

    const hashedPassword = await hash(changeUserPasswordInput.newPassword, 14);

    await UsersFeature.service.editUserPassword.run(userId, hashedPassword);
  }
}
