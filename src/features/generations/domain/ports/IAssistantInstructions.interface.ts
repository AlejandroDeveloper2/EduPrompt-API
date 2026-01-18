export interface IAssistantInstructions {
  getGenericInstructions(): Promise<string>;
  getImageInstructions(): Promise<string>;
}
