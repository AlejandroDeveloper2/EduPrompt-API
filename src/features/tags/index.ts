import { Feature } from "@/core/infrastructure/types";

import { TagMongoRepository } from "./infrastructure/repositories";
import { TagServiceContainer } from "./infrastructure/containers/TagService.container";
import { router as tagsRouter } from "./infrastructure/routes/v1/tags.route";

const tagsRepository = new TagMongoRepository();

/** Punto publico para acceder a la caracteristica Tags */
export const TagsFeature: Feature<TagMongoRepository, TagServiceContainer> = {
  featureName: "tags",
  router: tagsRouter,
  repository: tagsRepository,
  service: new TagServiceContainer(),
};
