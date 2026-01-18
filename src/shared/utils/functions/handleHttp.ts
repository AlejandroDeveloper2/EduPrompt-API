import { Response } from "express";

import { ServerErrorResponse, ServerResponse } from "@/core/domain/types";

/**
 * Maneja las respuestas HTTP del servidor enviando un objeto de respuesta tipado.
 *
 * @template T - Tipo de los datos contenidos en la respuesta del servidor.
 * @param res - Objeto de respuesta de Express utilizado para enviar la respuesta HTTP.
 * @param serverResponse - Objeto que contiene la estructura de la respuesta del servidor, tipado por `ServerResponse<T>`.
 * @param code - Código de estado HTTP que se enviará en la respuesta.
 *
 * @remarks
 * Esta función centraliza el manejo de respuestas HTTP, permitiendo enviar respuestas tipadas y códigos de estado personalizados.
 */
export const handleHttp = <T>(
  res: Response,
  serverResponse: ServerResponse<T>,
  code: number
): void => {
  res.status(code);
  res.send(serverResponse);
};

/** *
* Envía una respuesta de error estandarizada con el código de estado HTTP apropiado.
*
* Establece el estado de la respuesta a partir de serverErrorResponse.httpCode y envía la carga útil completa del error.
*
@param res Instancia de Response de Express.
@param serverErrorResponse Carga útil de error que cumple con ServerErrorResponse.
@returns void 
*/
export const handleHttpError = (
  res: Response,
  serverErrorResponse: ServerErrorResponse
): void => {
  res.status(serverErrorResponse.httpCode).json({
    status: "error",
    ...serverErrorResponse,
  });
};
