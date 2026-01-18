import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { Notification } from "../../../domain/entities";
import {
  CreateNotification,
  Order,
  UpdateNotification,
} from "../../../domain/types";
import { NotificationRepositoryType } from "../../../domain/repositories/NotificationRepository.interface";

import { MongoNotification, NotificationModel } from "./Notification.model";

/**
 * Convierte un documento de Mongo a objeto de dominio `Notification`.
 *
 * @param mongoNotification - Documento proveniente de MongoDB.
 * @returns Objeto `Notification`.
 */
const mapNotification = (
  mongoNotification: MongoNotification
): Notification => {
  const { _id, title, message, links, read, creationDate } = mongoNotification;
  return new Notification(
    _id.toString(),
    title,
    message,
    creationDate,
    read,
    links
  );
};

/**
 * Convierte documentos de Mongo a objetos de dominio `Notification`.
 *
 * @param mongoNotifications - Documentos provenientes de MongoDB.
 * @returns Array de objetos `Notification`.
 */
const mapNotifications = (
  mongoNotifications: MongoNotification[]
): Notification[] => {
  return mongoNotifications.map((notification) =>
    mapNotification(notification)
  );
};

/**
 * Repositorio para gestionar notificaciones del sistema usando MongoDB.
 * Implementa el contrato definido en `NotificationRepositoryType`.
 */
export class NotificationMongoRepository implements NotificationRepositoryType {
  /**
   * Crea una nueva notificación de sistema en la base de datos.
   *
   * @param newNotification - Objeto con los datos de la notificación de sistema a crear.
   * @throws {AppError} Si ocurre un error durante la creación.
   */
  async create(newNotification: CreateNotification): Promise<void> {
    try {
      await NotificationModel.create(newNotification);
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while creating the notification: ${error}`,
        false
      );
    }
  }

  /**
   * Obtiene todos las notificaciones de sistema.
   * @param order - Valor para ordenar el listado de notificaciones ya se ascendente o descendentemente.
   * @returns Respuesta con todas las notificaciones  de sistema.
   * @throws {AppError} Si ocurre un error durante la consulta.
   */
  async findAll(order: Order): Promise<Notification[]> {
    try {
      const sortOrder = order === "asc" ? 1 : -1;
      const notifications = await NotificationModel.find().sort({
        createdAt: sortOrder,
      });
      return mapNotifications(notifications.map((n) => n.toObject()));
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while finding all notificatios: ${error}`,
        false
      );
    }
  }
  /**
   * Busca una notificación por su ID.
   *
   * @param notificationId - ID de la notificación a buscar.
   * @returns La notificación o `null` si no existe.
   * @throws {AppError} Si ocurre un error durante la búsqueda.
   */
  async findById(notificationId: string): Promise<Notification | null> {
    try {
      const notification = await NotificationModel.findById(notificationId);

      if (!notification) return null;

      return mapNotification(notification.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while finding the notification: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza una notificación de sistema.
   *
   * @param notificationId - ID de la notificación a actualizar.
   * @param updatedNotification - Objeto con la información de la notificación actualizada `message`, `links`.
   * @returns null - Si el usuario no existe
   * @throws {AppError} Si ocurre un error durante la actualización.
   */
  async update(
    notificationId: string,
    updatedNotification: UpdateNotification
  ): Promise<void | null> {
    try {
      const result = await NotificationModel.findOneAndUpdate(
        { _id: notificationId },
        updatedNotification
      );
      if (!result) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while updating the notification: ${error}`,
        false
      );
    }
  }
  /**
   * Elimina múltiples notificaciones de sistema.
   *
   * @param notificationIds - Array de IDs de las notificaciones a eliminar.
   * @throws {AppError} Si ocurre un error durante la eliminación.
   */
  async deleteMany(notificationIds: string[]): Promise<void> {
    try {
      await NotificationModel.deleteMany({
        _id: { $in: notificationIds },
      });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while deleting notifications by id: ${error}`,
        false
      );
    }
  }
  /**
   * Cuenta  notificaciones por los Ids que coincidan.
   *
   * @param notificationIds - Array de IDs de las notificaciones a buscar y contar.
   * @throws {AppError} Si ocurre un error durante el conteo.
   */
  async count(notificationIds: string[]): Promise<number> {
    try {
      return await NotificationModel.countDocuments({
        _id: { $in: notificationIds },
      });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while counting notifications: ${error}`,
        false
      );
    }
  }
  /**
   * Marca como leidas múltiples notificaciones de sistema.
   *
   * @param notificationIds - Array de IDs de las notificaciones a marcar como leeidas.
   * @throws {AppError} Si ocurre un error durante la actualización.
   */
  async markAsRead(notificationIds: string[]): Promise<void> {
    try {
      await NotificationModel.updateMany(
        {
          _id: { $in: notificationIds },
        },
        { read: true }
      );
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while marking as read notifications: ${error}`,
        false
      );
    }
  }
}
