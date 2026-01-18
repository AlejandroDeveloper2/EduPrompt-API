import z from "zod/v4";

import { objectIdSchema } from "./objectIdSchema.dto";

export const UserIdParamDto = z.object({
  userId: objectIdSchema,
});
