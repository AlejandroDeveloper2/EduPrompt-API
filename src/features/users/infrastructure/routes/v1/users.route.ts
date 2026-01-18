import { Router } from "express";

import {
  validateDTO,
  authMiddleware,
  apiKeyGuard,
} from "@/core/infrastructure/middlewares";

import { userController } from "../../controllers/Users.controller";

import { UpdateUsernameDto } from "../../../application/dto/updateUsername.dto";
import { EditUserAccountTypeDto } from "../../../application/dto/editUserAccountType.dto";
import { EditUserTokenCoinsDto } from "../../../application/dto/editUserTokenCoins.dto";
import { UpdateUserPreferencesDto } from "../../../application/dto/user.dto";
import { SyncUserStatsDto } from "../../../application/dto/syncUserStats.dto";

const router = Router();

/** Endpoints para el módulo de usuarios */
// Endpoints Protegidos
router
  .get(
    "/profile",
    apiKeyGuard(["users:read"]),
    authMiddleware,
    userController.getUserProfile
  )
  .patch(
    "/username",
    apiKeyGuard(["users:write"]),
    validateDTO(UpdateUsernameDto, "body"),
    authMiddleware,
    userController.patchUsername
  )
  .patch(
    "/account-type",
    apiKeyGuard(["users:write"]),
    validateDTO(EditUserAccountTypeDto, "body"),
    authMiddleware,
    userController.patchUserAccountType
  )
  .patch(
    "/token-coins",
    apiKeyGuard(["users:write"]),
    validateDTO(EditUserTokenCoinsDto, "body"),
    authMiddleware,
    userController.patchUserTokenCoins
  )
  .patch(
    "/preferences",
    apiKeyGuard(["users:write"]),
    validateDTO(UpdateUserPreferencesDto, "body"),
    authMiddleware,
    userController.patchUserPreferences
  )
  .put(
    "/sync/stats",
    apiKeyGuard(["users:write"]),
    validateDTO(SyncUserStatsDto, "body"),
    authMiddleware,
    userController.putUserStats
  );

export { router };
