import { IAssistantInstructions } from "../ports/IAssistantInstructions.interface";

/**
 * Servicio que proporciona cadenas de instrucciones para el asistente delegando en una
 * implementación inyectada de IAssistantInstructions.
 *
 * Esta clase actúa como una capa fina de dominio/servicio para centralizar el acceso a
 * diferentes tipos de instrucciones (p. ej., genéricas o específicas para imágenes) y para
 * desacoplar a los llamadores de la implementación concreta del proveedor de instrucciones.
 *
 * @remarks
 * Los métodos del servicio son asíncronos y simplemente reenvían las llamadas a la implementación
 * subyacente de IAssistantInstructions. Cualquier error arrojado por la implementación subyacente
 * se propaga al llamador.
 */
export class AssistantInstructionsService {
  /**
   * Crea un nuevo AssistantInstructionsService.
   *
   * @param assistantInstructions - Una implementación de IAssistantInstructions usada para obtener el texto de las instrucciones.
   */
  constructor(private readonly assistantInstructions: IAssistantInstructions) {}
  /**
   * Recupera las instrucciones genéricas del asistente.
   *
   * Delegará en assistantInstructions.getGenericInstructions() y devuelve una Promise que se resuelve
   * con el texto de la instrucción.
   *
   * @returns Una Promise que se resuelve con la cadena de instrucción genérica.
   * @throws Propaga los errores lanzados por la implementación subyacente de IAssistantInstructions.
   */
  async getGenericInstructions(): Promise<string> {
    return await this.assistantInstructions.getGenericInstructions();
  }

  /**
   * Recupera las instrucciones del asistente específicas para imágenes.
   *
   * Delegará en assistantInstructions.getImageInstructions() y devuelve una Promise que se resuelve
   * con el texto de la instrucción orientado a la generación o el manejo de imágenes.
   *
   * @returns Una Promise que se resuelve con la cadena de instrucciones para imágenes.
   * @throws Propaga los errores lanzados por la implementación subyacente de IAssistantInstructions.
   */
  async getImageInstructions(): Promise<string> {
    return await this.assistantInstructions.getImageInstructions();
  }
}
