import { Tag } from "../entities";

type TagType = "prompt_tag" | "resource_tag";

type CreateTag = Pick<Tag, "name" | "type" | "tagId">;
interface UpdateTag extends Partial<Omit<CreateTag, "tagId">> {
  sync: boolean;
}

type Pagination = {
  limitNumber: number;
  pageNumber: number;
  skip: number;
};

export type { TagType, CreateTag, UpdateTag, Pagination };
