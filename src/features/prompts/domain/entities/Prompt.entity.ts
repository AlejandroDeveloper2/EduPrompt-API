/**
 * Entidad de dominio que representa un Prompt (indicaciones o instrucciones).
 * Modela los datos principales asociados a un prompt creado por un usuario.
 */
export class Prompt {
  /**
   * Crea una instancia de Prompt.
   * @param promptId Identificador único del prompt.
   * @param promptTitle Título breve y descriptivo del prompt.
   * @param promptText Contenido o instrucción completa del prompt.
   * @param tag Etiqueta o categoría asociada al prompt.
   * @param userId Identificador del usuario propietario del prompt.
   */
  constructor(
    public readonly promptId: string,
    public promptTitle: string,
    public promptText: string,
    public tag: string,
    public readonly userId: string
  ) {}
}
