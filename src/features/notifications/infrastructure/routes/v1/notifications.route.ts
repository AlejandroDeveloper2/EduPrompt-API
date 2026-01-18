import { Router } from "express";

import {
  adminAuthMiddleware,
  apiKeyGuard,
  validateDTO,
} from "@/core/infrastructure/middlewares";

import { CreateNotificationDto } from "../../../application/dto/createNotification.dto";
import { ListNotificationsFilterDto } from "../../../application/dto/findNotifications.dto";
import { NotificationIdParamDto } from "../../../application/dto/findNotification.dto";
import { UpdateNotificationDto } from "../../../application/dto/updateNotification.dto";
import { DeleteNotificationsByIdDto } from "../../../application/dto/deleteManyNotifications.dto";
import { MarkAsReadNotificationsDto } from "../../../application/dto/markAsReadNotifications.dto";

import { notificationController } from "../../controllers/Notifications.controller";

const router = Router();

/** Endpoints para el módulo de notificaciones de sistema solo admin.
 * Exepto el endpoint de obtener  todas las notifiaciones y una por Id*/
router
  .post(
    "/",
    apiKeyGuard(["notifications:write"]),
    adminAuthMiddleware,
    validateDTO(CreateNotificationDto, "body"),
    notificationController.postNotification
  )
  .get(
    "/",
    apiKeyGuard(["notifications:read"]),
    validateDTO(ListNotificationsFilterDto, "query"),
    notificationController.getNotifications
  )
  .get(
    "/:notificationId",
    apiKeyGuard(["notifications:read"]),
    validateDTO(NotificationIdParamDto, "params"),
    notificationController.getNotificationById
  )
  .put(
    "/:notificationId",
    apiKeyGuard(["notifications:write"]),
    adminAuthMiddleware,
    validateDTO(NotificationIdParamDto, "params"),
    validateDTO(UpdateNotificationDto, "body"),
    notificationController.putNotification
  )
  .delete(
    "/",
    apiKeyGuard(["notifications:write"]),
    adminAuthMiddleware,
    validateDTO(DeleteNotificationsByIdDto, "body"),
    notificationController.deleteManyNotifications
  )
  .patch(
    "/",
    apiKeyGuard(["notifications:write"]),
    validateDTO(MarkAsReadNotificationsDto, "body"),
    notificationController.patchNotificationsReadStatus
  );

export { router };
