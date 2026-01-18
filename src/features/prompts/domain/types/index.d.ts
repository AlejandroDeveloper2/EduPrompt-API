import { Prompt } from "../entities";

type Pagination = {
  limitNumber: number;
  pageNumber: number;
  skip: number;
};
type PromptsFilters = {
  tag?: string | undefined;
  title?: string | undefined;
  page?: string | undefined;
  limit?: string | undefined;
};

type CreatePrompt = Omit<Prompt, "userId">;
type UpdatePrompt = Omit<CreatePrompt, "promptId">;

export type { Pagination, PromptsFilters, CreatePrompt, UpdatePrompt };
