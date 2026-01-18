import { Request, Response, NextFunction } from "express";

import { ErrorMessages, handleHttpError } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

/**
 * Manejador centralizado de errores para capturar y manejar errores lanzados por los controladores.
 *
 * Si el error es una instancia de `AppError`, responde al cliente con el mensaje y código de error personalizado.
 * Para cualquier otro error, responde con un mensaje genérico de error interno del servidor y código 500.
 *
 * @param error - El error capturado, puede ser de cualquier tipo.
 * @param _req - Objeto de solicitud HTTP de Express.
 * @param res - Objeto de respuesta HTTP de Express.
 * @param _next - Función para pasar el control al siguiente middleware.
 */
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (error instanceof AppError) {
    handleHttpError(res, {
      name: error.name,
      httpCode: error.httpCode,
      isOperational: error.isOperational,
      description: error.message,
    });
    return;
  }

  handleHttpError(res, {
    name: ErrorMessages.INTERNAL_SERVER_ERROR,
    httpCode: 500,
    isOperational: false,
    description: `There's an unknown error: ${error}`,
  });
};
