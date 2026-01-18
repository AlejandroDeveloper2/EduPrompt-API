import {
  SendEmailChangeRequestOutput,
  SendEmailChangeRequestResponseDto,
} from "../dto/sendEmailChangeRequest.dto";

/**
 * Transforma la entidad de respuesta del endpoint de solicitud de cambio  de correo en un DTO validado.
 *
 * Esta función toma un objeto que contiene el correo actualizado tras el envio de la solicitud exitoso,
 * lo transforma en el formato esperado por el DTO de salida (`SendEmailChangeRequestResponseDto`) y valida su estructura.
 * Si la validación es exitosa, retorna una instancia de `SendEmailChangeRequestOutput`.
 *
 * @param entity - Objeto que contiene el correo actualizado listo para validar .
 * @returns Una instancia validada de `SendEmailChangeRequestOutput`.
 */
export const toSendEmailChangeRequestResponseDto = (entity: {
  updatedEmail: string;
}): SendEmailChangeRequestOutput => {
  const json = {
    updatedEmail: entity.updatedEmail,
  };
  return SendEmailChangeRequestResponseDto.parse(json);
};
