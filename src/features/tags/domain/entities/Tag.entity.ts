import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { TagType } from "../types";

/**
 * Entidad del dominio que representa una Etiqueta (Tag).
 *
 * Una Etiqueta tiene un identificador único y readonly, un nombre para mostrar y un tipo (TagType).
 * El constructor hace cumplir invariantes: el nombre de la etiqueta debe tener al menos 3 caracteres.
 *
 * @param tagId - Identificador único de la etiqueta. Esta propiedad es de solo lectura.
 * @param name - Nombre legible por humanos de la etiqueta. Debe contener al menos 3 caracteres.
 * @param type - Categoría o clasificación de la etiqueta (TagType).
 * @param userId -Id del Usuario propietario de la etiqueta.
 *
 * @throws {AppError} Si `name.length < 3`. El AppError lanzado usa:
 *  - code: ErrorMessages.VALIDATION_ERROR
 *  - status: 400
 *  - message: "El nombre de la etiqueta debe tener al menos 3 caracteres"
 *  - isOperational: true
 *
 * @remarks
 * - La validación se realiza de forma síncrona en el constructor para garantizar la consistencia de la entidad.
 * - `tagId` está pensado para ser inmutable una vez creada la entidad.
 */
export class Tag {
  constructor(
    public readonly tagId: string,
    public name: string,
    public type: TagType,
    public sync: boolean,
    public userId: string
  ) {
    if (name.length < 3)
      throw new AppError(
        ErrorMessages.VALIDATION_ERROR,
        400,
        "El nombre de la etiqueta debe tener al menos 3 caracteres",
        true
      );
  }
}
