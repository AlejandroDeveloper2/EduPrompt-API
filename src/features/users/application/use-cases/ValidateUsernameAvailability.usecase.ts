import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

export class ValidateUsernameAvailabilityUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}

  /**
   * Validar que un nombre de usuario esté disponible para su uso.
   *
   * Recupera un usuario por el nombre de usuario proporcionado y lanza un AppError si el nombre de usuario
   * ya está asociado a un usuario distinto, o si el nombre de usuario ya está tomado cuando
   * no se proporciona userId (por ejemplo, al crear un usuario).
   *
   * @param username - El nombre de usuario a validar.
   * @param userId - Id opcional del usuario que realiza la operación. Si se proporciona,
   *                 el nombre de usuario existente del mismo usuario no se considerará conflicto.
   * @returns Promise<void> que se resuelve cuando el nombre de usuario está disponible.
   * @throws {AppError} Cuando el nombre de usuario ya está en uso. El error contiene
   *                    ErrorMessages.USERNAME_ALREADY_EXISTS y el código HTTP 409.
   */
  async run(username: string, userId?: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);

    if ((userId && user && userId !== user.userId) || (user && !userId))
      throw new AppError(
        ErrorMessages.USERNAME_ALREADY_EXISTS,
        409,
        "Username is already taken",
        true
      );
  }
}
