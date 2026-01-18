import { EducationalResource } from "../entities";

type ResourceFormatKey = "text" | "table" | "image" | "chart";

type Pagination = {
  limitNumber: number;
  pageNumber: number;
  skip: number;
};

type EducationalResourceFilters = {
  formatKey?: ResourceFormatKey | undefined;
  tag?: string | undefined;
  title?: string | undefined;
  page?: string | undefined;
  limit?: string | undefined;
};

type CreateResource = Omit<EducationalResource, "creationDate" | "userId">;
type UpdateResource = Pick<EducationalResource, "title" | "groupTag">;

export type {
  ResourceFormatKey,
  Pagination,
  EducationalResourceFilters,
  CreateResource,
  UpdateResource,
};
