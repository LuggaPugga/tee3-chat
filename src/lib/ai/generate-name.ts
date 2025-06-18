import { generateText } from "ai"
import { generateChatNamePrompt } from "./prompts"
import { google } from "@ai-sdk/google"

export async function generateChatName(message: string) {
  const result = await generateText({
    model: google("gemini-2.0-flash-lite"),
    system: generateChatNamePrompt,
    prompt: message,
    maxTokens: 50,
  })

  console.log(result.text)

  return result.text
}
