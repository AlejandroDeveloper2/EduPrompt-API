import { Router } from "express";

import {
  adminAuthMiddleware,
  validateDTO,
} from "@/core/infrastructure/middlewares";

import { apiKeyController } from "../../controllers/ApiKey.controller";

import { CreateApiKeyDto } from "../../../application/dto/apiKey.dto";

const router = Router();

/** Endpoints para el módulo de api key solo user admin*/
router.post(
  "/create",
  adminAuthMiddleware,
  validateDTO(CreateApiKeyDto, "body"),
  apiKeyController.postCreateKey
);

export { router };
