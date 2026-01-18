import { ResourceFormatKey } from "../types";

/**
 * Entidad de dominio que representa un recurso educativo generado o gestionado por el sistema.
 * Modela la información principal del recurso, su formato y metadatos asociados.
 */
export class EducationalResource {
  /**
   * Crea una instancia de EducationalResource.
   * @param resourceId Identificador único del recurso.
   * @param title Título del recurso educativo.
   * @param content Contenido del recurso (texto, HTML, markdown, etc.).
   * @param format Descripción del formato de salida (por ejemplo: "PDF", "HTML").
   * @param formatKey Clave tipada del formato del recurso.
   * @param groupTag Etiqueta o grupo categórico al que pertenece el recurso.
   * @param creationDate Fecha de creación del recurso.
   * @param userId Identificador del usuario propietario/creador del recurso.
   */
  constructor(
    public readonly resourceId: string,
    public title: string,
    public content: string,
    public format: string,
    public formatKey: ResourceFormatKey,
    public groupTag: string,
    public creationDate: Date,
    public readonly userId: string
  ) {}
}
