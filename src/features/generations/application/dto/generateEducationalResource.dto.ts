import { z } from "zod/v4";

/** Dtos de entrada */
export const GenerationDto = z.object({
  userPrompt: z.string().min(1),
});

export const ResourceFormatKeyParamDto = z.object({
  resourceFormatkey: z.enum(["text", "image", "chart", "table"]),
});

/** Dtos de salida */
export const GenerationOutputDto = z.object({
  generationDate: z.date(),
  result: z.string().min(1),
});

/** Tipos de entrada */
export type GenerationInput = z.infer<typeof GenerationDto>;
export type ResourceFormatKeyParamInput = z.infer<
  typeof ResourceFormatKeyParamDto
>;

/** Tipos de salida */
export type GenerationOutput = z.infer<typeof GenerationOutputDto>;
