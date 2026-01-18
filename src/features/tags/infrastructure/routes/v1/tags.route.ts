import { Router } from "express";

import {
  apiKeyGuard,
  authMiddleware,
  validateDTO,
} from "@/core/infrastructure/middlewares";

import { CreateTagDto } from "@/features/tags/application/dto/createTag.dto";
import { TagIdParamDto } from "@/features/tags/application/dto/findTagById.dto";
import { TagFiltersDto } from "@/features/tags/application/dto/findTags.dto";
import { UpdateTagDto } from "@/features/tags/application/dto/updateTag.dto";
import { SyncTagsDto } from "@/features/tags/application/dto/syncTags.dto";
import { DeleteManyTagsDto } from "@/features/tags/application/dto/deleteManyTags.dto";

import { tagsController } from "../../controllers/Tags.controller";

const router = Router();

/** Endpoints para el módulo de tags */
router
  .post(
    "/",
    apiKeyGuard(["tags:write"]),
    validateDTO(CreateTagDto, "body"),
    authMiddleware,
    tagsController.postTag
  )
  .get(
    "/:tagId",
    apiKeyGuard(["tags:read"]),
    validateDTO(TagIdParamDto, "params"),
    authMiddleware,
    tagsController.getTagById
  )
  .get(
    "/",
    apiKeyGuard(["tags:read"]),
    validateDTO(TagFiltersDto, "query"),
    authMiddleware,
    tagsController.getTags
  )
  .patch(
    "/:tagId",
    apiKeyGuard(["tags:write"]),
    validateDTO(TagIdParamDto, "params"),
    validateDTO(UpdateTagDto, "body"),
    authMiddleware,
    tagsController.patchTag
  )
  .delete(
    "/",
    apiKeyGuard(["tags:write"]),
    validateDTO(DeleteManyTagsDto, "body"),
    authMiddleware,
    tagsController.deleteManyTags
  )
  .post(
    "/sync",
    apiKeyGuard(["tags:write"]),
    validateDTO(SyncTagsDto, "body"),
    authMiddleware,
    tagsController.postSyncTags
  );

export { router };
