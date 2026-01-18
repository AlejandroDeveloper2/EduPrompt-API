import {
  CreatePromptUseCase,
  DeleteManyPromptsUseCase,
  EditPromptUseCase,
  FindPromptByIdUseCase,
  FindPromptsByUserUseCase,
  SyncPromptsUseCase,
} from "../../application/use-cases";

import { PromptMongoRepository } from "../repositories";

const promptRepository = new PromptMongoRepository();

/**
 * Contenedor de servicios de prompts.
 *
 * Expone instancias de casos de uso relacionadas con prompts, ya
 * inicializadas con el repositorio de MongoDB. Facilita la inyección de
 * dependencias en controladores u otras capas superiores.
 *
 * Propiedades:
 * - createPrompt: Crea un nuevo prompt.
 * - deleteManyPrompts: Elimina múltiples prompts por criterios.
 * - editPrompt: Edita/actualiza un prompt existente.
 * - findPromptById: Busca un prompt por su ID.
 * - findPromptsByUser: Lista los prompts pertenecientes a un usuario.
 * - syncPrompts: Sincroniza prompts de un usuario.
 */
export class PromptsServiceContainer {
  /** Crea un nuevo prompt. */
  createPrompt = new CreatePromptUseCase(promptRepository);
  /** Elimina múltiples prompts según criterios de búsqueda. */
  deleteManyPrompts = new DeleteManyPromptsUseCase(promptRepository);
  /** Edita un prompt existente. */
  editPrompt = new EditPromptUseCase(promptRepository);
  /** Recupera un prompt por su identificador. */
  findPromptById = new FindPromptByIdUseCase(promptRepository);
  /** Obtiene los prompts asociados a un usuario. */
  findPromptsByUser = new FindPromptsByUserUseCase(promptRepository);
  /** Sincroniza prompts de un usuario. */
  syncPrompts = new SyncPromptsUseCase(promptRepository);
}
