import { NextFunction, Response, Request } from "express";

import { getSocketInstance } from "@/core/infrastructure/socket/SocketInstance";
import { handleHttp } from "@/shared/utils";

import { toNotificationOuputDto } from "../../application/mappers";
import { CreateNotificationInput } from "../../application/dto/createNotification.dto";
import { ListNotificationsFilterInput } from "../../application/dto/findNotifications.dto";
import { DeleteNotificationsByIdInput } from "../../application/dto/deleteManyNotifications.dto";
import { UpdateNotificationInput } from "../../application/dto/updateNotification.dto";
import { MarkAsReadNotificationsInput } from "../../application/dto/markAsReadNotifications.dto";

import { NotificationsServiceContainer } from "../containers/NotificationsService.container";

const notificationsServiceContainer = new NotificationsServiceContainer();

/**
 * Controller encargado de manejar las operaciones relacionadas con notificaciones.
 *
 * Se encarga de recibir las solicitudes HTTP, validarlas y delegar la lógica de negocio
 * al servicio `SystemNotificationService`. Retorna las respuestas en un formato unificado.
 */
class NotificationController {
  /**
   * Crea una nueva notificación de sistema.
   *
   * @route POST /notifications
   * @param {Request} req - Objeto de solicitud con los datos de la notificación en el body.
   * @param {Response} res - Objeto de respuesta para enviar el resultado.
   * @param {NextFunction} next - Función para pasar errores al middleware global.
   * @returns {Promise<void>} Envía un 201 si la notificación fue creado exitosamente.
   */

  async postNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notificationInput = req.body as CreateNotificationInput;
      await notificationsServiceContainer.createNotification.run(
        notificationInput
      );

      const io = getSocketInstance();

      io.emit("notifications:new", notificationInput);

      handleHttp(
        res,
        { data: null, message: "Notification created successfully!" },
        201
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Obtiene todos las notificaciones del sistema para usuarios autenticados.
   *
   * @route GET /notifications
   * @param {Request} req - Objeto de solicitud con filtros como `order` en la query de ruta.
   * @param {Response} res - Objeto de respuesta con todas las notificaciones.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 con las notificaciones encontradas.
   */
  async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters = req.query as ListNotificationsFilterInput;
      const notifications =
        await notificationsServiceContainer.findNotifications.run(filters);

      handleHttp(
        res,
        {
          data: notifications.map((n) => toNotificationOuputDto(n)),
          message: "Notifications loaded successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Obtiene una notificación por su ID.
   *
   * @route GET /notifications/:notificationId
   * @param {Request} req - Objeto de solicitud con `notificationId` en los parámetros de ruta.
   * @param {Response} res - Objeto de respuesta con la notificación encontrada.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 con la notificación encontrada.
   */
  async getNotificationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notificationId } = req.params;

      const notification =
        await notificationsServiceContainer.findNotificationById.run(
          notificationId as string
        );

      handleHttp(
        res,
        {
          data: toNotificationOuputDto(notification),
          message: "Notification loaded successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Actualiza los datos de la notificación.
   *
   * @route PUT /notifications/:notificationId
   * @param {Request} req - Objeto de solicitud con `notificationId` y los nuevos datos.
   * @param {Response} res - Objeto de respuesta.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 si la actualización fue exitosa.
   */
  async putNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notificationId } = req.params;
      const updatedNotificationInput = req.body as UpdateNotificationInput;

      await notificationsServiceContainer.editNotification.run(
        notificationId as string,
        updatedNotificationInput
      );

      const io = getSocketInstance();

      io.emit("notifications:update", {
        ...updatedNotificationInput,
        notificationId,
      });

      handleHttp(
        res,
        {
          data: null,
          message: "Notification updated successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Elimina múltiples notificaciones de sistema.
   *
   * @route DELETE /notifications
   * @param {Request} req - Objeto de solicitud con un arreglo de IDs de notificaciones a eliminar.
   * @param {Response} res - Objeto de respuesta.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 si las notificaciones fueron eliminadas exitosamente.
   */
  async deleteManyNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as DeleteNotificationsByIdInput;

      await notificationsServiceContainer.deleteManyNotifications.run(payload);

      const io = getSocketInstance();

      io.emit("notifications:deleteMany", payload.notificationIds);

      handleHttp(
        res,
        {
          data: null,
          message: "Notifications deleted successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Marca como leidas múltiples notificaciones de sistema.
   *
   * @route PATCH /notifications
   * @param {Request} req - Objeto de solicitud con un arreglo de IDs de notificaciones a marcar.
   * @param {Response} res - Objeto de respuesta.
   * @param {NextFunction} next - Función para manejar errores.
   * @returns {Promise<void>} Envía un 200 si las notificaciones fueron marcadas como leidas exitosamente.
   */
  async patchNotificationsReadStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as MarkAsReadNotificationsInput;

      await notificationsServiceContainer.markAsReadNotifications.run(payload);

      const io = getSocketInstance();

      io.emit("notifications:markAsRead", payload.notificationIds);

      handleHttp(
        res,
        {
          data: null,
          message: "Notifications marked as read successfully!",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
