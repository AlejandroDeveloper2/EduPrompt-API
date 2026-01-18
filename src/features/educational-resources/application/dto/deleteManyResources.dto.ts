import { z } from "zod/v4";

export const DeleteResourcesByIdDto = z.object({
  resourceIds: z.array(z.uuidv4()).min(1),
});

export type DeleteResourcesByIdInput = z.infer<typeof DeleteResourcesByIdDto>;
