import { NotificationRepositoryType } from "../../domain/repositories/NotificationRepository.interface";

import { CreateNotificationInput } from "../dto/createNotification.dto";

export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepositoryType
  ) {}
  /**
   * Crea una nueva notificación.
   *
   * @param createNotificationInput - Objeto con los datos de la notificación.
   */
  async run(createNotificationInput: CreateNotificationInput): Promise<void> {
    await this.notificationRepository.create(createNotificationInput);
  }
}
