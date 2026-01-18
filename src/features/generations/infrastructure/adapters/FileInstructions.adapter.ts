import path from "path";
import { readFile } from "fs/promises";

import { IAssistantInstructions } from "../../domain/ports/IAssistantInstructions.interface";

/**
 * Adaptador para leer las instrucciones del asistente desde archivos de plantilla.
 *
 * Esta clase implementa la interfaz {@link IAssistantInstructions} y proporciona
 * métodos para recuperar plantillas de instrucciones desde el sistema de archivos.
 *
 * @implements {IAssistantInstructions}
 */
export class FileInstructionsAdapter implements IAssistantInstructions {
  private readonly basePath = path.join(__dirname, "../templates");

  async getGenericInstructions(): Promise<string> {
    return readFile(
      path.join(this.basePath, "generic-instructions.md"),
      "utf8"
    );
  }

  async getImageInstructions(): Promise<string> {
    return readFile(path.join(this.basePath, "image-instructions.md"), "utf8");
  }
}
