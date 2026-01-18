import { z } from "zod/v4";

/** Dto de entrada */
export const SendEmailChangeRequestDto = z.object({
  updatedEmail: z.email(),
});

/** Dto de salida */
export const SendEmailChangeRequestResponseDto = SendEmailChangeRequestDto;

/** Tipo de entrada */
export type SendEmailChangeRequestInput = z.infer<
  typeof SendEmailChangeRequestDto
>;
/** Tipo de salida */
export type SendEmailChangeRequestOutput = z.infer<
  typeof SendEmailChangeRequestResponseDto
>;
