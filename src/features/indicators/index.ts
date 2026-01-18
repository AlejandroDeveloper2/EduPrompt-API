import { Feature } from "@/core/infrastructure/types";

import { router as indicatorsRouter } from "./infrastructure/routes/v1/indicators.route";

import { IndicatorMongoRepository } from "./infrastructure/repositories/mongo/Indicator.mongoose.repository";
import { IndicatorsServiceContainer } from "./infrastructure/containers/IndicatorsService.container";

const indicatorsRepository = new IndicatorMongoRepository();

/** Punto publico para acceder a la caracteristica Indicators */
export const IndicatorsFeature: Feature<
  IndicatorMongoRepository,
  IndicatorsServiceContainer
> = {
  featureName: "indicators",
  router: indicatorsRouter,
  repository: indicatorsRepository,
  service: new IndicatorsServiceContainer(),
};
