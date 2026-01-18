import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { NotificationRepositoryType } from "../../domain/repositories/NotificationRepository.interface";

import { UpdateNotificationInput } from "../dto/updateNotification.dto";

export class EditNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepositoryType
  ) {}

  /**
   * Actualiza los datos de una notificación.
   *
   * @param notificationId - ID de la notificación.
   * @param updateNotificationInput - Objeto con los datos de la notificación actualizados.
   * @throws {AppError} Si el prompt no existe.
   */
  async run(
    notificationId: string,
    updateNotificationInput: UpdateNotificationInput
  ): Promise<void> {
    const result = await this.notificationRepository.update(
      notificationId,
      updateNotificationInput
    );

    if (result === null)
      throw new AppError(
        ErrorMessages.NOTIFICATION_NOT_FOUND,
        404,
        "Notification does not exist in the database",
        true
      );
  }
}
