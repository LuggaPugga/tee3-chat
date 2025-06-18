import { models } from "./models"

const recommendedModelIds = [
  "gemini-2.5-flash-preview-04-17",
  "Gemini 2.5 Pro",
  "o4-mini",
  "claude-4-sonnet",
  "claude-4-sonnet-reasoning",
  "deepseek-r1-distill-llama",
]

export const recommendedModels = models.filter((model) => recommendedModelIds.includes(model.id))
