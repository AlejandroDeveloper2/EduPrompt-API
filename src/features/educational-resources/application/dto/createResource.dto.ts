import { z } from "zod/v4";

/* DTOs de entrada (request)*/
export const CreateResourceDto = z.object({
  resourceId: z.uuidv4(),
  title: z.string().min(1),
  content: z.string().min(1),
  format: z.string().min(1),
  formatKey: z.enum(["text", "table", "image", "chart"]),
  groupTag: z.string().min(1),
});

/* Tipos de entrada */
export type CreateResourceInput = z.infer<typeof CreateResourceDto>;
