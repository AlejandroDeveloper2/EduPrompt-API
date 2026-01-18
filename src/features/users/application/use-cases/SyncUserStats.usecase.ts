import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

import { SyncUserStatsInput } from "../dto/syncUserStats.dto";

export class SyncUserStatsUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}
  /**
   * Actualiza, sincroniza las estadisticas de un usuario específico.
   *
   * @param userId - El identificador único del usuario cuyo perfil de usuario se actualizará.
   * @param userStats - Las estadisticas actualizadas.
   * @returns Una promesa que se resuelve cuando la operación se completa.
   * @throws {AppError} Si no se encuentra el usuario con el ID proporcionado.
   */
  async run(userId: string, userStats: SyncUserStatsInput): Promise<void> {
    const result = await this.userRepository.updateUserStats(userId, userStats);
    if (result === null)
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        404,
        "User does not exists in the database",
        true
      );
  }
}
