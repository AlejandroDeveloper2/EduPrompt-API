import {
  CreateEducationalResourceUseCase,
  DeleteManyResourcesUseCase,
  FindEducationalResourceByIdUseCase,
  FindEducationalResourcesByUserUseCase,
  SyncResourcesUseCase,
  UpdateEducationalResourceUseCase,
} from "../../application/use-cases";

import { EducationalResourceMongoRepository } from "../repositories";

const resourcesRepository = new EducationalResourceMongoRepository();

/**
 * Contenedor de servicios de recursos educativos.
 *
 * Expone instancias de los casos de uso de recursos educativos ya
 * inicializadas con el repositorio de MongoDB, facilitando la inyección de
 * dependencias en controladores u otras capas.
 *
 * Propiedades:
 * - createEducationalResource: Crea un nuevo recurso educativo.
 * - deleteManyResources: Elimina múltiples recursos por criterios.
 * - findEducationalResourceById: Busca un recurso por su ID.
 * - findEducationalResourcesByUser: Lista los recursos de un usuario.
 * - updateResourceGroupTag: Actualiza la etiqueta/grupo del recurso.
 * - updateResourceTitle: Actualiza el título del recurso.
 */
export class ResourcesServiceContainer {
  /** Crea un nuevo recurso educativo. */
  createEducationalResource = new CreateEducationalResourceUseCase(
    resourcesRepository
  );
  /** Elimina múltiples recursos según criterios de búsqueda. */
  deleteManyResources = new DeleteManyResourcesUseCase(resourcesRepository);
  /** Recupera un recurso por su identificador. */
  findEducationalResourceById = new FindEducationalResourceByIdUseCase(
    resourcesRepository
  );
  /** Obtiene los recursos asociados a un usuario. */
  findEducationalResourcesByUser = new FindEducationalResourcesByUserUseCase(
    resourcesRepository
  );
  /** Actualiza un recurso educativo existente. */
  updateEducationalResource = new UpdateEducationalResourceUseCase(
    resourcesRepository
  );
  /** Sincroniza recursos educativos*/
  syncResources = new SyncResourcesUseCase(resourcesRepository);
}
