import { z } from "zod/v4";

//Dto de entrada
export const CreateApiKeyDto = z.object({
  name: z.string().min(1),
  scopes: z.array(
    z.enum([
      "auth:read",
      "auth:write",
      "users:read",
      "users:write",
      "resources:read",
      "resources:write",
      "prompts:read",
      "prompts:write",
      "notifications:read",
      "notifications:write",
      "generations:write",
      "indicators:read",
      "indicators:write",
      "tags:read",
      "tags:write",
    ])
  ),
  expiresAt: z.date().optional().nullable(),
});

//Tipos de entrada
export type CreateApiKeyInput = z.infer<typeof CreateApiKeyDto>;
