import {
  CreateApiKeyUseCase,
  VerifySecretUseCase,
} from "../../application/use-cases";

import { ApiKeyMongoRepository } from "../repositories";

// Repositorio concreto utilizado por los casos de uso relacionados con API Keys.
// Encapsula el acceso a la base de datos (MongoDB) para crear y verificar claves.
const apiKeyRepository = new ApiKeyMongoRepository();

/**
 * Contenedor de servicios para el módulo de API Keys.
 *
 * Expone instancias listas para usar de los casos de uso que gestionan
 * la creación y verificación de secretos de claves API, inyectando el
 * repositorio de persistencia correspondiente.
 *
 * Propiedades:
 * - createApiKey: Caso de uso que crea una nueva API Key y su secreto asociado.
 * - verifySecret: Caso de uso que valida que un secreto proporcionado
 *                 corresponde a una API Key registrada.
 */
export class ApiKeyServiceContainer {
  // Crea una nueva API Key en el sistema.
  createApiKey = new CreateApiKeyUseCase(apiKeyRepository);
  // Verifica el secreto de una API Key existente.
  verifySecret = new VerifySecretUseCase(apiKeyRepository);
}
