import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { User } from "../../domain/entities";
import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

export class FindUserByUsernameUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}
  /**
   * Recupera un usuario por su nombre de usuario.
   *
   * @param username - El nombre de usuario único del usuario a recuperar.
   * @returns Una promesa que resuelve con el objeto {@link User} encontrado.
   * @throws {AppError} Si no se encuentra un usuario con el Username proporcionado, lanza un error con código 404.
   */
  async run(username: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    if (!user)
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        404,
        "User does not exists in the database",
        true
      );
    return user;
  }
}
