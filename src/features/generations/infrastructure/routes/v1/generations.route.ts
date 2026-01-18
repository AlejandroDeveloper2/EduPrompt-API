import { Router } from "express";

import { apiKeyGuard, validateDTO } from "@/core/infrastructure/middlewares";

import {
  GenerationDto,
  ResourceFormatKeyParamDto,
} from "../../../application/dto/generateEducationalResource.dto";

import { generationController } from "../../controllers/Generations.controller";

const router = Router();

/** Endpoints para el módulo de generaciones */
router.post(
  "/:resourceFormatkey",
  apiKeyGuard(["generations:write"]),
  validateDTO(ResourceFormatKeyParamDto, "params"),
  validateDTO(GenerationDto, "body"),
  generationController.postGenerateEducationalResource
);

export { router };
