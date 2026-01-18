import { Feature } from "@/core/infrastructure/types";

import { router as promptsRouter } from "./infrastructure/routes/v1/prompts.route";

import { PromptsServiceContainer } from "./infrastructure/containers/PromptsService.container";

import { PromptMongoRepository } from "./infrastructure/repositories";

const promptRepository = new PromptMongoRepository();

/** Punto publico para acceder a la caracteristica Prompts */
export const PromptsFeature: Feature<
  PromptMongoRepository,
  PromptsServiceContainer
> = {
  featureName: "prompts",
  router: promptsRouter,
  repository: promptRepository,
  service: new PromptsServiceContainer(),
};
