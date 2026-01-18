import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { NotificationRepositoryType } from "../../domain/repositories/NotificationRepository.interface";

import { MarkAsReadNotificationsInput } from "../dto/markAsReadNotifications.dto";

export class MarkAsReadNotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepositoryType
  ) {}

  /**
   * Marca como leidas múltiples notificaciones de sistema.
   *
   * @param markAsReadNotificationsInput - Objeto con el array de IDs de las notificaciones a marcar como leeidas.
   * @throws {AppError} Si ocurre un error durante la actualización.
   */
  async run(
    markAsReadNotificationsInput: MarkAsReadNotificationsInput
  ): Promise<void> {
    const { notificationIds } = markAsReadNotificationsInput;
    const existingNotifications: number =
      await this.notificationRepository.count(notificationIds);

    if (existingNotifications < notificationIds.length)
      throw new AppError(
        ErrorMessages.SOME_NOTIFICATION_NOT_FOUND,
        404,
        "Some notification does not exist in the database",
        true
      );
    await this.notificationRepository.markAsRead(notificationIds);
  }
}
