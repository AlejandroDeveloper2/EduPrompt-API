import { PaginatedResponse } from "@/core/domain/types";

import { Prompt } from "../entities";
import { CreatePrompt, Pagination, UpdatePrompt } from "../types";

export interface PromptRespositoryType {
  create: (userId: string, newPrompt: CreatePrompt) => Promise<void>;
  findAllByUser: (
    query: Record<string, unknown>,
    pagination: Pagination
  ) => Promise<PaginatedResponse<Prompt>>;
  findById: (promptId: string) => Promise<Prompt | null>;
  update: (
    userId: string,
    promptId: string,
    updatedPrompt: UpdatePrompt
  ) => Promise<void | null>;
  deleteMany: (userId: string, promptIds: string[]) => Promise<void>;
  count: (userId: string, promptIds: string[]) => Promise<number>;
}
