import { AccountStatus, UserPreferences } from "../types";

/**
 * Entidad de dominio que representa a un usuario del sistema.
 * Encapsula datos y reglas simples de acceso para evitar estados inválidos
 * y facilitar su uso en la capa de aplicación y persistencia.
 */
export class User {
  /**
   * Crea una nueva instancia de User.
   * @param userId Identificador único del usuario (inmutable).
   * @param userName Nombre público del usuario.
   * @param email Correo electrónico del usuario.
   * @param password Hash de la contraseña del usuario.
   * @param tokenCoins Saldo de tokens o monedas disponibles.
   * @param isPremiumUser Indica si el usuario posee suscripción premium.
   * @param accountStatus Estado actual de la cuenta.
   * @param userPreferences Preferencias de configuración del usuario.
   */
  constructor(
    public readonly userId: string,
    public userName: string,
    public email: string,
    public password: string,
    public tokenCoins: number,
    public isPremiumUser: boolean,
    public accountStatus: AccountStatus,
    public userPreferences: UserPreferences
  ) {}
}
