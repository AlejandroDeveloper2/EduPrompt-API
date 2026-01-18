import {
  CreateUserUseCase,
  EditUserAccountStatusUseCase,
  EditUserAccountTypeUseCase,
  EditUserEmailUseCase,
  EditUsernameUseCase,
  EditUserPasswordUseCase,
  EditUserPreferencesUseCase,
  EditUserTokenCoinsUseCase,
  FindUserByEmailUseCase,
  FindUserByUsernameUseCase,
  FindUserProfileUseCase,
  SyncUserStatsUseCase,
  ValidateUserEmailAvailabilityUseCase,
  ValidateUsernameAvailabilityUseCase,
} from "../../application/use-cases";

import { UserMongoRepository } from "../repositories";

/**
 * Repositorio concreto de usuarios basado en MongoDB.
 * Se inyecta en los casos de uso para acceder a la capa de persistencia.
 */
const userRepository = new UserMongoRepository();

/**
 * Contenedor de servicios (casos de uso) relacionados con Usuarios.
 *
 * Este objeto centraliza la creación e inyección de dependencias de los casos de uso
 * de la funcionalidad de usuarios. Cada propiedad expone una instancia lista para usar,
 * con el repositorio de usuarios ya inyectado.
 *
 * Uso típico:
 *   await UserServiceContainer.createUser.execute(dto)
 *
 * Dependencias:
 * - userRepository: implementación del repositorio de usuarios (MongoDB).
 */
export class UserServiceContainer {
  /**
   * Crea un nuevo usuario en el sistema a partir de los datos provistos.
   * @see CreateUserUseCase
   */
  createUser = new CreateUserUseCase(userRepository);
  /**
   * Actualiza el estado de la cuenta del usuario (activo, suspendido, etc.).
   * @see EditUserAccountStatusUseCase
   */
  editUserAccountStatus = new EditUserAccountStatusUseCase(userRepository);
  /**
   * Cambia el tipo de cuenta del usuario (por ejemplo: free, premium, admin).
   * @see EditUserAccountTypeUseCase
   */
  editUserAccountType = new EditUserAccountTypeUseCase(userRepository);
  /**
   * Modifica el correo electrónico del usuario, gestionando las validaciones necesarias.
   * @see EditUserEmailUseCase
   */
  editUserEmail = new EditUserEmailUseCase(userRepository);
  /**
   * Actualiza el nombre de usuario garantizando su disponibilidad.
   * @see EditUsernameUseCase
   */
  editUsername = new EditUsernameUseCase(userRepository);
  /**
   * Cambia la contraseña del usuario aplicando las políticas de seguridad.
   * @see EditUserPasswordUseCase
   */
  editUserPassword = new EditUserPasswordUseCase(userRepository);
  /**
   * Edita las preferencias y configuración personal del usuario.
   * @see EditUserPreferencesUseCase
   */
  editUserPreferences = new EditUserPreferencesUseCase(userRepository);
  /**
   * Ajusta el balance de tokens/monedas del usuario.
   * @see EditUserTokenCoinsUseCase
   */
  editUserTokenCoins = new EditUserTokenCoinsUseCase(userRepository);
  /**
   * Busca y retorna un usuario por su correo electrónico.
   * @see FindUserByEmailUseCase
   */
  findUserByEmail = new FindUserByEmailUseCase(userRepository);
  /**
   * Busca y retorna un usuario por su nombre de usuario.
   * @see FindUserByUsernameUseCase
   */
  findUserByUsername = new FindUserByUsernameUseCase(userRepository);
  /**
   * Obtiene el perfil completo del usuario.
   * @see FindUserProfileUseCase
   */
  findUserProfile = new FindUserProfileUseCase(userRepository);
  /**
   * Sincroniza y recalcula estadísticas asociadas al usuario.
   * @see SyncUserStatsUseCase
   */
  syncUserStats = new SyncUserStatsUseCase(userRepository);
  /**
   * Valida si un correo electrónico está disponible para ser usado por un usuario.
   * @see ValidateUserEmailAvailabilityUseCase
   */
  validateUserEmailAvailability = new ValidateUserEmailAvailabilityUseCase(
    userRepository
  );
  /**
   * Verifica la disponibilidad de un nombre de usuario.
   * @see ValidateUsernameAvailabilityUseCase
   */
  validateUsernameAvailability = new ValidateUsernameAvailabilityUseCase(
    userRepository
  );
}
