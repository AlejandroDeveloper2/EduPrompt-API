import { ApiKey } from "../entities";
import { CreateKey } from "../types";

export interface ApiKeyRepositoryType {
  create(data: CreateKey): Promise<ApiKey>;
  findById(keyId: string): Promise<ApiKey | null>;
  setLastUsed(keyId: string, at: Date): Promise<void>;
  deactivate(keyId: string): Promise<void>;
}
