import { PaginatedResponse } from "@/core/domain/types";

import { EducationalResource } from "../entities";
import { CreateResource, Pagination, UpdateResource } from "../types";

interface EducationalResourceRepositoryType {
  create: (userId: string, newResource: CreateResource) => Promise<void>;
  findAllByUser: (
    query: Record<string, unknown>,
    pagination: Pagination
  ) => Promise<PaginatedResponse<EducationalResource>>;
  findById: (resourceId: string) => Promise<EducationalResource | null>;
  update: (
    userId: string,
    resourceId: string,
    updatedResource: UpdateResource
  ) => Promise<void | null>;
  deleteMany: (userId: string, resourceIds: string[]) => Promise<void>;
  count: (userId: string, resourceIds: string[]) => Promise<number>;
}

export type { EducationalResourceRepositoryType };
