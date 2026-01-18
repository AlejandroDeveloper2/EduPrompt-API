import { hash } from "bcryptjs";

import { ResetUserPasswordInput } from "../dto/resetUserPassword.dto";

import { UsersFeature } from "@/features/users";

export class ResetUserPasswordUseCase {
  constructor() {}
  /**
   * Restablece la contraseña de un usuario.
   *
   * @param userId - Identificador único del usuario.
   * @param resetUserPasswordInput - Objeto con la nueva contraseña en texto plano.
   * @throws {AppError} - Si el usuario no existe.
   */
  async run(
    userId: string,
    resetUserPasswordInput: ResetUserPasswordInput
  ): Promise<void> {
    const hashedPassword = await hash(resetUserPasswordInput.newPassword, 14);
    await UsersFeature.service.editUserPassword.run(userId, hashedPassword);
  }
}
