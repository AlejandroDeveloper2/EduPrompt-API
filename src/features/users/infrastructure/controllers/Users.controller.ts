import { NextFunction, Response } from "express";

import { RequestExtended } from "@/core/infrastructure/types";

import { handleHttp } from "@/shared/utils";

import { UpdateUsernameInput } from "../../application/dto/updateUsername.dto";
import { EditUserAccountTypeInput } from "../../application/dto/editUserAccountType.dto";
import { EditUserTokenCoinsInput } from "../../application/dto/editUserTokenCoins.dto";
import { UserPreferencesInput } from "../../application/dto/user.dto";
import { SyncUserStatsInput } from "../../application/dto/syncUserStats.dto";
import { toUserResponseDto } from "../../application/mappers";

import { UserServiceContainer } from "../containers/UserService.container";

const userServiceContainer = new UserServiceContainer();

/**
 * UsersController
 *
 * Controlador encargado de manejar las operaciones relacionadas con el módulo de usuarios.
 * Expone métodos HTTP para consultar y actualizar atributos de un usuario.
 */
class UsersController {
  /**
   * Obtiene la información del perfil de un usuario por su ID.
   *
   * @route GET /users/profile
   * @param {RequestExtended} req - Objeto de solicitud con `userId` para traer el perfil de usuario
   * @param res - Objeto Response de Express.
   * @param next - Función Next de Express para manejar errores.
   * @returns Devuelve un objeto con la información del usuario.
   */
  async getUserProfile(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const user = await userServiceContainer.findUserProfile.run(
        userId as string
      );
      handleHttp(
        res,
        {
          data: toUserResponseDto(user),
          message: "User profile retrieved successfully",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Actualiza el nombre de usuario.
   *
   * @route PATCH /users/username
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y el nombre de usuario actualizado.
   * @param res - Objeto Response de Express.
   * @param next - Función Next de Express para manejar errores.
   */
  async patchUsername(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const payload = req.body as UpdateUsernameInput;

      await userServiceContainer.editUsername.run(userId, payload);
      handleHttp(
        res,
        { data: null, message: "Username updated successfully" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Cambia el tipo de cuenta de un usuario (ejemplo: estándar a premium).
   *
   * @route PATCH /users/account-type
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y el nuevo tipo de cuenta del usuario.
   * @param res - Objeto Response de Express.
   * @param next - Función Next de Express para manejar errores.
   */
  async patchUserAccountType(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const payload = req.body as EditUserAccountTypeInput;

      await userServiceContainer.editUserAccountType.run(userId, payload);
      handleHttp(
        res,
        { data: null, message: "User account type updated successfully" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Actualiza la cantidad de monedas/tokens de un usuario.
   *
   * @route PATCH /users/token-coins
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y el nuevo monto de tokens para el usuario.
   * @param res - Objeto Response de Express.
   * @param next - Función Next de Express para manejar errores.
   */
  async patchUserTokenCoins(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const payload = req.body as EditUserTokenCoinsInput;

      await userServiceContainer.editUserTokenCoins.run(userId, payload);
      handleHttp(
        res,
        { data: null, message: "User token coins amount updated successfully" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Actualiza las preferencias o configuraciones de un usuario.
   *
   * @route PATCH /users/preferences
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y las preferencias de usuario actualizadas.
   * @param res - Objeto Response de Express.
   * @param next - Función Next de Express para manejar errores.
   */
  async patchUserPreferences(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const updatedPreferences = req.body as UserPreferencesInput;

      await userServiceContainer.editUserPreferences.run(
        userId,
        updatedPreferences
      );
      handleHttp(
        res,
        { data: null, message: "User preferences updated successfully" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Actualiza y sincroniza las estadisticas de un usuario.
   *
   * @route PUT /users/sync/stats
   * @param {RequestExtended} req - Objeto de solicitud con `userId` y las estadisticas de usuario actualizadas.
   * @param res - Objeto Response de Express.
   * @param next - Función Next de Express para manejar errores.
   */
  async putUserStats(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const updatedUserStats = req.body as SyncUserStatsInput;

      await userServiceContainer.syncUserStats.run(userId, updatedUserStats);

      handleHttp(
        res,
        { data: null, message: "User stats updated successfully" },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const userController = new UsersController();
