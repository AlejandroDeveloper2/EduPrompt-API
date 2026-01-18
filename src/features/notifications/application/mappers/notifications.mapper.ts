import {
  NotificationOutput,
  NotificationOutputDto,
} from "../dto/findNotifications.dto";

import { Notification } from "../../domain/entities";

/**
 * Transforma una entidad Notification en un objeto de respuesta seguro para el endpoint de notifications.
 *
 * Esta función toma una instancia de la entidad NotificationOutput, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO NotificationOutputDto.
 *
 * @param entity Instancia de Notification proveniente de la base de datos.
 * @returns Objeto validado de tipo NotificationResponse, listo para ser enviado como respuesta al cliente.
 */
export const toNotificationOuputDto = (
  entity: Notification
): NotificationOutput => {
  const json = {
    notificationId: entity.notificationId,
    title: entity.title,
    message: entity.message,
    links: entity.links,
    read: entity.read,
    creationDate: entity.creationDate,
  };

  return NotificationOutputDto.parse(json);
};
