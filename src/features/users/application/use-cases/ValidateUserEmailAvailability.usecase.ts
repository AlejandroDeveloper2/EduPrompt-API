import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

export class ValidateUserEmailAvailabilityUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}

  /**
   * Validar que una dirección de correo electrónico esté disponible para su uso.
   *
   * Recupera un usuario por el correo proporcionado y lanza un AppError si el correo
   * ya está asociado a un usuario distinto, o si el correo ya está tomado cuando
   * no se proporciona userId (por ejemplo, al crear un usuario).
   *
   * @param email - La dirección de correo a validar.
   * @param userId - Id opcional del usuario que realiza la operación. Si se proporciona,
   *                 el correo existente del mismo usuario no se considerará conflicto.
   * @returns Promise<void> que se resuelve cuando el correo está disponible.
   * @throws {AppError} Cuando el correo ya está en uso. El error contiene
   *                    ErrorMessages.USER_EMAIL_ALREADY_EXISTS y el código HTTP 409.
   */
  async run(email: string, userId?: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if ((userId && user && userId !== user.userId) || (user && !userId))
      throw new AppError(
        ErrorMessages.USER_EMAIL_ALREADY_EXISTS,
        409,
        "El correo electrónico ya está en uso",
        true
      );
  }
}
