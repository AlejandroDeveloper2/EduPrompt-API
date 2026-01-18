/**
 * Entidad de dominio que representa una sesión de autenticación de un usuario.
 * Contiene los tokens de acceso/refresh, estado de actividad y ventanas de tiempo.
 */
export class Session {
  /**
   * Crea una instancia de Session.
   *
   * @param sessionId Identificador único de la sesión.
   * @param sessionToken Token de sesión (acceso) asociado.
   * @param refreshToken Token de actualización para renovar el acceso.
   * @param active Estado de la sesión (activa o no).
   * @param createdAt Fecha de creación de la sesión.
   * @param expiresAt Fecha de expiración de la sesión.
   */
  constructor(
    public readonly sessionId: string,
    public sessionToken: string,
    public refreshToken: string,
    public active: boolean,
    public createdAt: Date,
    public expiresAt: Date
  ) {}
}
