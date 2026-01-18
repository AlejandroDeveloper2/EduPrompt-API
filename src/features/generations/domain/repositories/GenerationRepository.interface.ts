import { Generation } from "../entities";

export interface GenerationRepositoryType {
  generateTextResource: (
    assistantInstructions: string,
    userPrompt: string
  ) => Promise<Generation>;

  generateImageResource: (
    processedPrompt: string
  ) => Promise<Generation | null>;
}
