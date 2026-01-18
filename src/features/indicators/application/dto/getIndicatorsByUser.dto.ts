import { z } from "zod/v4";

/** Dtos de salida */
export const IndicatorsOutputDto = z.object({
  generatedResources: z.number().positive().default(0),
  usedTokens: z.number().positive().default(0),
  lastGeneratedResource: z.string().nullable(),
  dowloadedResources: z.number().positive().default(0),
  savedResources: z.number().positive().default(0),
});

/** Tipos de salida */
export type IndicatorsOutput = z.infer<typeof IndicatorsOutputDto>;
