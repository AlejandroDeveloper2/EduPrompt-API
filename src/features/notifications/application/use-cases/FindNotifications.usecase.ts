import { Notification } from "../../domain/entities";
import { NotificationRepositoryType } from "../../domain/repositories/NotificationRepository.interface";

import { ListNotificationsFilterInput } from "../dto/findNotifications.dto";

export class FindNotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepositoryType
  ) {}

  /**
   * Obtiene todas las notificaciones de sistema.
   * @param filters Objeto con los filtros para ordenar el listado de notificaciones como `order`
   * @returns Respuesta con las notificaciones del sistema.
   */
  async run(filters: ListNotificationsFilterInput): Promise<Notification[]> {
    return await this.notificationRepository.findAll(filters.order);
  }
}
