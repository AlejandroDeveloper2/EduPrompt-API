/**
 * Entidad de dominio que representa el resultado de una generación de recurso.
 * Contiene la fecha en la que se produjo y el contenido generado.
 */
export class Generation {
  /**
   * Crea una instancia de Generation.
   * @param generationDate Fecha en la que se realizó la generación.
   * @param result Contenido o texto resultante de la generación.
   */
  constructor(public generationDate: Date, public result: string) {}
}
