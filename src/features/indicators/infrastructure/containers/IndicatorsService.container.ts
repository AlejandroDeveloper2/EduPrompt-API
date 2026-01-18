import {
  CreateIndicatorsUseCase,
  GetIndicatorsByUserUseCase,
  SyncIndicatorsUseCase,
  UpdateIndicatorsUseCase,
} from "../../application/use-cases";

import { IndicatorMongoRepository } from "../repositories/mongo/Indicator.mongoose.repository";

const indicatorsRepository = new IndicatorMongoRepository();

/**
 * Contenedor de servicios de indicadores.
 *
 * Expone instancias de casos de uso relacionadas con indicadores, ya
 * inicializadas con el repositorio de MongoDB. Facilita su inyección en
 * controladores u otras capas superiores.
 *
 * Propiedades:
 * - getIndicatorsByUser: Obtiene los indicadores asociados a un usuario.
 * - createIndicators: Crea e inicializa los indicadores de un usuario.
 * - updateIndicators: Actualiza las métricas de indicadores de un usuario.
 * - syncIndicators: Sincroniza de forma total toda la información de los indicadores de un usuario
 */
export class IndicatorsServiceContainer {
  /** Obtiene los indicadores de un usuario. */
  getIndicatorsByUser = new GetIndicatorsByUserUseCase(indicatorsRepository);
  /** Crea e inicializa los indicadores de un usuario. */
  createIndicators = new CreateIndicatorsUseCase(indicatorsRepository);
  /** Actualiza las métricas de indicadores de un usuario. */
  updateIndicators = new UpdateIndicatorsUseCase(indicatorsRepository);
  /** Sincroniza de forma total toda la información de los indicadores de un usuario */
  syncIndicators = new SyncIndicatorsUseCase(indicatorsRepository);
}
