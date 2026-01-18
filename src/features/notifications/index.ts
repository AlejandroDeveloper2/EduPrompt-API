import { Feature } from "@/core/infrastructure/types";

import { router as NotificationsRouter } from "./infrastructure/routes/v1/notifications.route";

import { NotificationsServiceContainer } from "./infrastructure/containers/NotificationsService.container";
import { NotificationMongoRepository } from "./infrastructure/repositories/mongo/Notification.mongoose.repository";

import { registerNotificationSocket } from "./infrastructure/sockets/notifications.socket";

const notificationRepository = new NotificationMongoRepository();

/** Punto publico para acceder a la caracteristica Notifications */
export const NotificationsFeature: Feature<
  NotificationMongoRepository,
  NotificationsServiceContainer
> = {
  featureName: "notifications",
  router: NotificationsRouter,
  repository: notificationRepository,
  service: new NotificationsServiceContainer(),
  socket: registerNotificationSocket,
};
