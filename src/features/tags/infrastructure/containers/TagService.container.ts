import {
  CreateTagUseCase,
  DeleteManyTagsUseCase,
  FindTagByIdUseCase,
  FindTagsUseCase,
  SyncTagsUseCase,
  UpdateTagUseCase,
} from "../../application/use-cases";

import { TagMongoRepository } from "../repositories";

const tagRepository = new TagMongoRepository();

/**
 * Clase contenedor para gestionar casos de uso relacionados con etiquetas.
 * Proporciona acceso centralizado a todas las operaciones de etiquetas incluyendo creación, recuperación, actualización, eliminación y sincronización.
 *
 * @class TagServiceContainer
 * @property {CreateTagUseCase} createTag - Caso de uso para crear nuevas etiquetas
 * @property {FindTagByIdUseCase} findTagById - Caso de uso para recuperar una etiqueta por su identificador
 * @property {UpdateTagUseCase} updateTag - Caso de uso para actualizar etiquetas existentes
 * @property {DeleteManyTagsUseCase} deleteManyTags - Caso de uso para eliminar etiquetas
 * @property {FindTagsUseCase} findTags - Caso de uso para recuperar múltiples etiquetas
 * @property {SyncTagsUseCase} syncTags - Caso de uso para sincronizar etiquetas de un usuario
 */
export class TagServiceContainer {
  createTag = new CreateTagUseCase(tagRepository);
  findTagById = new FindTagByIdUseCase(tagRepository);
  updateTag = new UpdateTagUseCase(tagRepository);
  deleteManyTags = new DeleteManyTagsUseCase(tagRepository);
  findTags = new FindTagsUseCase(tagRepository);
  syncTags = new SyncTagsUseCase(tagRepository);
}
