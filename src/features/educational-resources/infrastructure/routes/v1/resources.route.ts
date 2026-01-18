import { Router } from "express";

import {
  apiKeyGuard,
  authMiddleware,
  validateDTO,
} from "@/core/infrastructure/middlewares";

import { CreateResourceDto } from "../../../application/dto/createResource.dto";
import { ResourcesFiltersDto } from "../../../application/dto/findResourcesByUser.dto";
import { ResourceIdParamDto } from "../../../application/dto/findResourceById.dto";
import { DeleteResourcesByIdDto } from "../../../application/dto/deleteManyResources.dto";
import { UpdateResourceDto } from "@/features/educational-resources/application/dto/updateResource.dto";

import { educationalResourceController } from "../../controllers/EducationalResources.controller";
import { SyncResourcesDto } from "@/features/educational-resources/application/dto/syncResources.dto";

const router = Router();

/** Endpoints para el módulo de recursos educativos */
router
  .post(
    "/",
    apiKeyGuard(["resources:write"]),
    validateDTO(CreateResourceDto, "body"),
    authMiddleware,
    educationalResourceController.postEducationalResource
  )
  .get(
    "/",
    apiKeyGuard(["resources:read"]),
    validateDTO(ResourcesFiltersDto, "query"),
    authMiddleware,
    educationalResourceController.getEducationalResourcesByUser
  )
  .get(
    "/:resourceId",
    apiKeyGuard(["resources:read"]),
    validateDTO(ResourceIdParamDto, "params"),
    authMiddleware,
    educationalResourceController.getEducationalResourceById
  )
  .patch(
    "/:resourceId",
    apiKeyGuard(["resources:write"]),
    validateDTO(ResourceIdParamDto, "params"),
    validateDTO(UpdateResourceDto, "body"),
    authMiddleware,
    educationalResourceController.patchResource
  )
  .delete(
    "/",
    apiKeyGuard(["resources:write"]),
    validateDTO(DeleteResourcesByIdDto, "body"),
    authMiddleware,
    educationalResourceController.deleteManyResources
  )
  .post(
    "/sync",
    apiKeyGuard(["resources:write"]),
    validateDTO(SyncResourcesDto, "body"),
    authMiddleware,
    educationalResourceController.postSyncResources
  );

export { router };
