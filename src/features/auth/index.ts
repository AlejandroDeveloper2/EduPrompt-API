import { Feature } from "@/core/infrastructure/types";

import { router as authRouter } from "./infrastructure/routes/v1/auth.route";

import { AuthMongoRepository } from "./infrastructure/repositories/mongo/Auth.mongoose.repository";
import { AuthServiceContainer } from "./infrastructure/containers/AuthService.container";

const authRepository = new AuthMongoRepository();

/** Punto publico para acceder a la caracteristica Auth */
export const AuthFeature: Feature<AuthMongoRepository, AuthServiceContainer> = {
  featureName: "auth",
  router: authRouter,
  repository: authRepository,
  service: new AuthServiceContainer(),
};
