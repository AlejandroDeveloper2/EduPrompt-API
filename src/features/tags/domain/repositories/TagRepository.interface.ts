import { PaginatedResponse } from "@/core/domain/types";

import { Tag } from "../entities";

import { CreateTag, Pagination, UpdateTag } from "../types";

export interface TagRepository {
  createTag: (userId: string, newTag: CreateTag) => Promise<void>;
  findTagById: (tagId: string) => Promise<Tag | null>;
  findTags: (
    query: Record<string, unknown>,
    pagination: Pagination
  ) => Promise<PaginatedResponse<Tag>>;
  updateTag: (
    userId: string,
    tagId: string,
    updatedTag: UpdateTag
  ) => Promise<void | null>;
  deleteManyTags: (userId: string, tagIds: string[]) => Promise<number>;
}
