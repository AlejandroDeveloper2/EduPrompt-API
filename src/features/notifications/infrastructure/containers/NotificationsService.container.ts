import {
  CreateNotificationUseCase,
  DeleteManyNotificationsUseCase,
  EditNotificationUseCase,
  FindNotificationByIdUseCase,
  FindNotificationsUseCase,
  MarkAsReadNotificationsUseCase,
} from "../../application/use-cases";

import { NotificationMongoRepository } from "../repositories/mongo/Notification.mongoose.repository";

const notificationRepository = new NotificationMongoRepository();

/**
 * Contenedor de servicios de notificaciones.
 *
 * Expone instancias de los casos de uso relacionados con notificaciones
 * ya inicializadas con el repositorio de MongoDB. Facilita la inyección
 * de dependencias en controladores o capas superiores.
 *
 * Propiedades:
 * - createNotification: Crea una nueva notificación.
 * - deleteManyNotifications: Elimina múltiples notificaciones por criterios.
 * - editNotification: Edita/actualiza una notificación existente.
 * - findNotificationById: Busca una notificación por su ID.
 * - findNotifications: Lista/busca notificaciones según filtros.
 * - markAsReadNotifications: Marca una o varias notificaciones como leídas.
 */
export class NotificationsServiceContainer {
  /** Crea una nueva notificación. */
  createNotification = new CreateNotificationUseCase(notificationRepository);
  /** Elimina múltiples notificaciones según criterios de búsqueda. */
  deleteManyNotifications = new DeleteManyNotificationsUseCase(
    notificationRepository
  );
  /** Edita una notificación existente. */
  editNotification = new EditNotificationUseCase(notificationRepository);
  /** Recupera una notificación por su identificador. */
  findNotificationById = new FindNotificationByIdUseCase(
    notificationRepository
  );
  /** Obtiene un conjunto de notificaciones aplicando filtros. */
  findNotifications = new FindNotificationsUseCase(notificationRepository);
  /** Marca como leídas una o varias notificaciones. */
  markAsReadNotifications = new MarkAsReadNotificationsUseCase(
    notificationRepository
  );
}
