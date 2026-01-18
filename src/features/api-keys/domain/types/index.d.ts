import { ApiKey } from "../entities";

type ApiKeyScope =
  | "auth:read"
  | "auth:write"
  | "users:read"
  | "users:write"
  | "resources:read"
  | "resources:write"
  | "prompts:read"
  | "prompts:write"
  | "notifications:read"
  | "notifications:write"
  | "generations:write"
  | "indicators:read"
  | "indicators:write"
  | "tags:read"
  | "tags:write";

type CreateKey = Omit<ApiKey, "createdAt" | "lastUsedAt">;

export type { ApiKeyScope, CreateKey };
