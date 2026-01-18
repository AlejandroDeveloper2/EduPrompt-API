import { Request, Response, NextFunction } from "express";

import { handleHttp } from "@/shared/utils";

import {
  GenerationInput,
  ResourceFormatKeyParamInput,
} from "../../application/dto/generateEducationalResource.dto";
import { toGenerationOutputDto } from "../../application/mappers";

import { GenerationsServiceContainer } from "../containers/GenerationService.container";

const generationsServiceContainer = new GenerationsServiceContainer();

/**
 * Controlador para la generación de recursos educativos.
 * Orquesta la solicitud HTTP hacia el servicio de generación y formatea la respuesta.
 */
class GenerationsController {
  /**
   * Genera un recurso educativo a partir de un prompt de usuario y un formato solicitado.
   *
   * Flujo:
   * - Valida y extrae los datos del cuerpo y parámetros de la petición.
   * - Invoca al servicio de generación.
   * - Mapea el resultado al DTO de respuesta y responde con 201.
   * - Delegará el manejo de errores al middleware de errores.
   *
   * @param {Request} req Objeto de solicitud de Express. Debe incluir en body { userPrompt } y en params { resourceFormatkey }.
   * @param {Response} res Objeto de respuesta de Express utilizado para enviar el recurso generado.
   * @param {NextFunction} next Función next de Express para pasar el control al manejador de errores.
   * @returns {Promise<void>} No retorna valor; envía la respuesta HTTP con el recurso generado.
   * @throws Propaga cualquier error al middleware de manejo de errores mediante next(error).
   */
  async postGenerateEducationalResource(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as GenerationInput;
      const { resourceFormatkey } = req.params as ResourceFormatKeyParamInput;

      const generatedResource =
        await generationsServiceContainer.generateEducationalResource.run(
          resourceFormatkey,
          payload
        );

      handleHttp(
        res,
        {
          data: toGenerationOutputDto(generatedResource),
          message: " Resource generated successfully!",
        },
        201
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const generationController = new GenerationsController();
