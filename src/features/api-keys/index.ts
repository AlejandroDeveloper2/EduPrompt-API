import { Feature } from "@/core/infrastructure/types";

import { router as apiKeysRouter } from "./infrastructure/routes/v1/apiKeys.route";

import { ApiKeyServiceContainer } from "./infrastructure/containers/ApiKeyService.container";
import { ApiKeyMongoRepository } from "./infrastructure/repositories";

const apiKeysRepository = new ApiKeyMongoRepository();

/** Punto publico para acceder a la caracteristica Api Keys */
export const ApiKeysFeature: Feature<
  ApiKeyMongoRepository,
  ApiKeyServiceContainer
> = {
  featureName: "apiKeys",
  router: apiKeysRouter,
  repository: apiKeysRepository,
  service: new ApiKeyServiceContainer(),
};
