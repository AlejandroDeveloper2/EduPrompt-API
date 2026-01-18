import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { Notification } from "../../domain/entities";
import { NotificationRepositoryType } from "../../domain/repositories/NotificationRepository.interface";

export class FindNotificationByIdUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepositoryType
  ) {}
  /**
   * Busca una notificación por su ID.
   *
   * @param notificationId - ID de la notificación.
   * @returns La notificación.
   * @throws {AppError} Si la notificación no existe.
   */
  async run(notificationId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(
      notificationId
    );
    if (!notification)
      throw new AppError(
        ErrorMessages.NOTIFICATION_NOT_FOUND,
        404,
        "Notification does not exist in the database",
        true
      );
    return notification;
  }
}
