import { LangTemplate, NotificationLink } from "../types";

/**
 * Entidad de dominio que representa una notificación del sistema dirigida a un usuario o cliente.
 * Contiene la información mínima para mostrarla en la UI y enlazar acciones relacionadas.
 *
 * Inmutable en cuanto a su identificador; el resto de campos pueden actualizarse
 * a lo largo del ciclo de vida (por ejemplo, marcar como leída).
 */
export class Notification {
  /**
   * Crea una instancia de Notification.
   * @param notificationId Identificador único de la notificaci��n (persistencia/transport).
   * @param title Título corto y descriptivo que resume la notificación.
   * @param message Mensaje o descripción detallada que será mostrado al usuario.
   * @param creationDate Fecha de creación/emisión de la notificación.
   * @param read Indica si la notificación ya fue leída por el usuario (opcional).
   * @param links Arreglo de enlaces/acciones relacionadas para navegación contextual (opcional).
   */
  constructor(
    public readonly notificationId: string,
    public title: LangTemplate,
    public message: LangTemplate,
    public creationDate: Date,
    public read?: boolean,
    public links?: NotificationLink[]
  ) {}
}
