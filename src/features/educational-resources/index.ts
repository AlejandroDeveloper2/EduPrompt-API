import { Feature } from "@/core/infrastructure/types";

import { router as resourcesRouter } from "./infrastructure/routes/v1/resources.route";

import { EducationalResourceMongoRepository } from "./infrastructure/repositories/mongo/Resource.mongoose.repository";
import { ResourcesServiceContainer } from "./infrastructure/containers/ResourcesService.container";

const resourcesRepository = new EducationalResourceMongoRepository();

/** Punto publico para acceder a la caracteristica Educational Resources */
export const EducationalResourcesFeature: Feature<
  EducationalResourceMongoRepository,
  ResourcesServiceContainer
> = {
  featureName: "resources",
  router: resourcesRouter,
  repository: resourcesRepository,
  service: new ResourcesServiceContainer(),
};
