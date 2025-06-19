import { generateText } from "ai"
import { generateChatNamePrompt } from "./prompts"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { unhash } from "../hashing"
import { db } from "@/utils/instant-admin"

export async function generateChatName(message: string, userId: string) {
  const userData = await db.query({
    apiKeys: {
      $: {
        where: {
          user: userId,
        },
      },
    },
  })

  const apiKeys = userData.apiKeys || []

  const googleKey = apiKeys.find((key) => key.provider === "google")?.key
  const openrouterKey = apiKeys.find((key) => key.provider === "openrouter")?.key
  const openaiKey = apiKeys.find((key) => key.provider === "openai")?.key
  const anthropicKey = apiKeys.find((key) => key.provider === "anthropic")?.key

  let model
  switch (true) {
    case !!googleKey: {
      const unhashedKey = unhash(googleKey)
      if (!unhashedKey) {
        return "New Chat"
      }
      const google = createGoogleGenerativeAI({ apiKey: unhashedKey })
      model = google("gemini-2.0-flash")
      break
    }
    case !!openrouterKey: {
      const unhashedKey = unhash(openrouterKey)
      if (!unhashedKey) {
        return "New Chat"
      }
      const openrouter = createOpenRouter({ apiKey: unhashedKey })
      model = openrouter("google/gemini-2.0-flash")
      break
    }
    case !!openaiKey: {
      const unhashedKey = unhash(openaiKey)
      if (!unhashedKey) {
        return "New Chat"
      }
      const openai = createOpenAI({ apiKey: unhashedKey })
      model = openai("gpt-4o-mini")
      break
    }
    case !!anthropicKey: {
      const unhashedKey = unhash(anthropicKey)
      if (!unhashedKey) {
        return "New Chat"
      }
      const anthropic = createAnthropic({ apiKey: unhashedKey })
      model = anthropic("claude-3-5-haiku-latest")
      break
    }
    default:
      return "New Chat"
  }

  const result = await generateText({
    model,
    system: generateChatNamePrompt,
    prompt: message,
    maxTokens: 50,
  })

  return result.text
}
