import { Feature } from "@/core/infrastructure/types";

import { router as usersRouter } from "./infrastructure/routes/v1/users.route";

import { UserServiceContainer } from "./infrastructure/containers/UserService.container";
import { UserMongoRepository } from "./infrastructure/repositories";

const usersRepository = new UserMongoRepository();

/** Punto publico para acceder a la caracteristica Users */
export const UsersFeature: Feature<UserMongoRepository, UserServiceContainer> =
  {
    featureName: "users",
    router: usersRouter,
    repository: usersRepository,
    service: new UserServiceContainer(),
  };
