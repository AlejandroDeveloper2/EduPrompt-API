import { AppError } from "@/core/domain/exeptions/AppError";
import { TransactionContext } from "@/core/domain/ports/TransactionContext.interface";

import { ErrorMessages } from "@/shared/utils";

import { User } from "../../../domain/entities";

import {
  AccountStatus,
  CreateUser,
  UserPreferences,
  UserStats,
} from "../../../domain/types";

import { MongoUser, UserModel } from "./User.model";

import { UserRepositoryType } from "../../../domain/repositories/UserRepository.interface";

/**
 * Mapea un objeto de tipo `MongoUser` a un objeto de tipo `User`.
 *
 * Asigna el campo `_id` de `MongoUser` al campo `userId` de `User` y copia el resto de las propiedades.
 *
 * @param mongoUser - El objeto de usuario proveniente de la base de datos MongoDB.
 * @returns Un nuevo objeto de tipo `User` con las propiedades mapeadas.
 */
const mapUser = (mongoUser: MongoUser): User => {
  const {
    _id,
    userName,
    email,
    password,
    isPremiumUser,
    userPreferences,
    tokenCoins,
    accountStatus,
  } = mongoUser;

  return new User(
    _id.toString(),
    userName,
    email,
    password,
    tokenCoins,
    isPremiumUser,
    accountStatus,
    userPreferences
  );
};

/**
 * Repositorio para gestionar operaciones relacionadas con usuarios en la base de datos utilizando Mongoose.
 *
 * Proporciona métodos para crear, buscar y actualizar usuarios, manejando los posibles errores internos del servidor.
 *
 * Implementa la interfaz `UserRepositoryType`.
 */
export class UserMongoRepository implements UserRepositoryType {
  /**
   * Crea un nuevo usuario en la base de datos.
   *
   * @param newUser - Los datos del usuario a crear.
   * @param ctx - TransactionContext opcional para ejecutar la creación dentro de una transacción.
   * @returns Una promesa con el `userId` del usuario que se resuelve cuando el usuario es creado correctamente.
   * @throws {AppError} Lanza un error si ocurre un problema interno del servidor durante la creación del usuario.
   */
  async create(
    newUser: CreateUser,
    ctx?: TransactionContext
  ): Promise<Pick<User, "userId">> {
    try {
      if (ctx && "session" in ctx) {
        const [created] = await UserModel.create([newUser], {
          session: ctx.session,
        });
        return { userId: created!._id.toString() };
      }
      const createdUser = await UserModel.create(newUser);
      return { userId: createdUser._id.toString() };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while creating the user: ${error}`,
        false
      );
    }
  }
  /**
   * Busca un usuario por su identificador único en la base de datos.
   *
   * @param userId - El identificador único del usuario a buscar.
   * @returns Una promesa que resuelve con el usuario encontrado mapeado al dominio, o `null` si no existe.
   * @throws {AppError} Lanza un error si ocurre un problema interno del servidor durante la búsqueda.
   */
  async findById(userId: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) return null;

      return mapUser(user.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while finding the user: ${error}`,
        false
      );
    }
  }

  /**
   * Busca un usuario por su dirección de correo electrónico.
   *
   * @param email - La dirección de correo electrónico del usuario a buscar.
   * @returns Una promesa que resuelve con el objeto usuario si se encuentra, o `null` si no existe un usuario con ese correo.
   * @throws {AppError} Lanza un error interno del servidor si la consulta a la base de datos falla.
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return null;
      return mapUser(user.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while finding the user: ${error}`,
        false
      );
    }
  }

  /**
   * Busca un usuario por su nombre de usuario.
   *
   * @param userName - El nombre de usuario del usuario a buscar.
   * @returns Una promesa que resuelve con el objeto {@link User} encontrado, o `null` si no se encuentra ningún usuario.
   * @throws {AppError} Lanza un error interno del servidor si la consulta a la base de datos falla.
   */
  async findByUsername(userName: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ userName });
      if (!user) return null;
      return mapUser(user.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while finding the user: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza el nombre de usuario de un usuario por su identificador único.
   *
   * @param userId - El identificador único del usuario cuyo nombre de usuario se va a actualizar.
   * @param updatedUsername - El nuevo nombre de usuario para establecer.
   * @returns Una promesa que se resuelve cuando la operación de actualización se completa o null si no encuentra el usuario.
   * @throws {AppError} Lanza un error interno del servidor si la actualización falla.
   */
  async updateUsername(
    userId: string,
    updatedUsername: string
  ): Promise<void | null> {
    try {
      const result = await UserModel.findOneAndUpdate(
        { _id: userId },
        { userName: updatedUsername }
      );
      if (!result) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while updating username: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza la dirección de correo electrónico de un usuario identificado por su ID.
   *
   * @param userId - El identificador único del usuario cuyo correo electrónico se va a actualizar.
   * @param updatedEmail - El nuevo correo electrónico que se establecerá para el usuario.
   * @returns Una promesa que se resuelve cuando la operación de actualización se completa o `null` si no existe.
   * @throws {AppError} Lanza un AppError con un código de estado 500 si la actualización falla.
   */
  async updateEmail(
    userId: string,
    updatedEmail: string
  ): Promise<void | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        { email: updatedEmail }
      );
      if (!updatedUser) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while updating user email: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza el tipo de cuenta de un usuario estableciendo el flag `isPremiumUser`.
   *
   * @param userId - El identificador único del usuario cuyo tipo de cuenta se va a actualizar.
   * @param isPremiumUser - Un booleano que indica si el usuario debe ser marcado como usuario premium.
   * @returns Una promesa que se resuelve cuando la operación de actualización se completa.
   * @throws {AppError} Lanza un error interno del servidor si la operación de actualización falla.
   */
  async updateAccountType(
    userId: string,
    isPremiumUser: boolean
  ): Promise<void | null> {
    try {
      const result = await UserModel.findOneAndUpdate(
        { _id: userId },
        { isPremiumUser }
      );
      if (!result) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while updating user account type: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza el estado de la cuenta de un usuario por su identificador único.
   *
   * @param userId - El identificador único del usuario cuyo estado de cuenta se va a actualizar.
   * @param accountStatus - El nuevo estado de la cuenta para establecer al usuario. Puede ser "active" o "inactive".
   * @returns Una promesa que se resuelve cuando la operación de actualización se completa o null si no encuentra el usuario.
   * @throws {AppError} Lanza un error interno del servidor si la operación de actualización falla.
   */
  async updateAccountStatus(
    userId: string,
    accountStatus: AccountStatus
  ): Promise<void | null> {
    try {
      const result = await UserModel.findOneAndUpdate(
        { _id: userId },
        { accountStatus }
      );
      if (!result) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while updating the user account status: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza el valor de `tokenCoins` para un usuario identificado por el ID proporcionado.
   *
   * @param userId - El identificador único del usuario cuyo tokenCoins será actualizado.
   * @param tokenCoins - El nuevo valor que se establecerá para los tokenCoins del usuario.
   * @returns Una promesa que se resuelve cuando la operación de actualización se completa o null cuando no encuentra el usuario.
   * @throws {AppError} Lanza un error interno del servidor si la operación de actualización falla.
   */
  async updateTokenCoins(
    userId: string,
    tokenCoins: number
  ): Promise<void | null> {
    try {
      const result = await UserModel.findOneAndUpdate(
        { _id: userId },
        { tokenCoins }
      );
      if (!result) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while updating user token coins amount: ${error}`,
        false
      );
    }
  }
  /**
   * Actualiza el valor de `password` para un usuario identificado por el ID proporcionado.
   *
   * @param userId - El identificador único del usuario cuya contraseña de acceso será actualizada.
   * @param newPassword - El nuevo valor que se establecerá para la contraseña de acceso del usuario.
   * @returns Una promesa que se resuelve cuando la operación de actualización se completa o null si no encuentra el usuario.
   * @throws {AppError} Lanza un error interno del servidor si la operación de actualización falla.
   */
  async updateUserPassword(
    userId: string,
    newPassword: string
  ): Promise<void | null> {
    try {
      const result = await UserModel.findOneAndUpdate(
        { _id: userId },
        { password: newPassword }
      );
      if (!result) return null;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while updating the user password: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza el valor de `userPreferences` para un usuario identificado por el ID proporcionado.
   *
   * @param userId - El identificador único del usuario cuyas preferencias o configuraciones serán actualizadas.
   * @param updatedPreferences - El nuevo valor que se establecerá para las preferencias del usuario.
   * @returns Una promesa que se resuelve cuando la operación de actualización se completa.
   * @throws {AppError} Lanza un error interno del servidor si la operación de actualización falla.
   */
  async updateUserPreferences(
    userId: string,
    updatedPreferences: Partial<UserPreferences>
  ): Promise<void> {
    try {
      await UserModel.updateOne(
        { _id: userId },
        { userPreferences: { ...updatedPreferences } }
      );
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while updating user preferences: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza, sincroniza las estadisticas de un usuario específico.
   *
   * @param userId - El identificador único del usuario cuyo perfil de usuario se actualizará.
   * @param userStats - Las estadisticas actualizadas.
   * @returns Una promesa que se resuelve cuando la operación se completa o null si no encuentra el usuario.
   * @throws {AppError} Lanza un error interno del servidor si la operación de actualización falla.
   */
  async updateUserStats(
    userId: string,
    userStats: UserStats
  ): Promise<void | null> {
    try {
      const result = await UserModel.findOneAndUpdate(
        { _id: userId },
        { ...userStats }
      );
      if (!result) return null;
    } catch (error: unknown) {
      console.log(error);
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An occurred while updating user stats: ${error}`,
        false
      );
    }
  }
}
