import { Feature } from "@/core/infrastructure/types";

import { router as generationsRouter } from "./infrastructure/routes/v1/generations.route";

import { GenerationsServiceContainer } from "./infrastructure/containers/GenerationService.container";
import { GenerationOpenAIRepository } from "./infrastructure/repositories/openai/Generation.openai.repository";

const generationsRepository = new GenerationOpenAIRepository();

/** Punto publico para acceder a la caracteristica Resources Generation */
export const GenerationsFeature: Feature<
  GenerationOpenAIRepository,
  GenerationsServiceContainer
> = {
  featureName: "generations",
  router: generationsRouter,
  repository: generationsRepository,
  service: new GenerationsServiceContainer(),
};
