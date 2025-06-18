import { createServerFn } from "@tanstack/react-start"
import { APICallError, CoreMessage, LanguageModelV1, streamText } from "ai"
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderMetadata,
  GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google"
import { models } from "./models"
import { promptBuilder } from "./prompts"
import { createOpenAI } from "@ai-sdk/openai"

import { init, id } from "@instantdb/admin"
import schema from "instant.schema"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { AnthropicProviderOptions, createAnthropic } from "@ai-sdk/anthropic"
import { unhash } from "../hashing"
import authMiddleware from "@/lib/middleware"

const db = init({
  appId: "d93ce927-79f1-4dd7-8618-df5668c4f0f7",
  adminToken: process.env.INSTANT_DB_ADMIN_TOKEN as string,
  schema: schema,
})

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  model: string
  reasoning?: string
  grounding_data?: GoogleGenerativeAIProviderMetadata["groundingMetadata"]
  tokens_used?: number
  tokens_per_second?: number
  request_duration_ms?: number
  error?: string
}

export interface FileAttachment {
  id: string
  url: string
  path: string
  contentType?: string
}

/**
 * Checks if a file is an image based on its path and content type
 */
function isImageFile(attachment: FileAttachment): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i
  const hasImageExtension = imageExtensions.test(attachment.path)
  const hasImageContentType = attachment.contentType?.startsWith("image/")

  return hasImageExtension || Boolean(hasImageContentType)
}

/**
 * Checks if a file is a PDF based on its path and content type
 */
function isPDFFile(attachment: FileAttachment): boolean {
  const pdfExtension = /\.pdf$/i
  const hasPDFExtension = pdfExtension.test(attachment.path)
  const hasPDFContentType = attachment.contentType === "application/pdf"

  return hasPDFExtension || hasPDFContentType
}

/**
 * Creates a multimodal message content array for the AI SDK
 */
function createMessageContent(
  textContent: string,
  imageAttachments: FileAttachment[],
  pdfAttachments: FileAttachment[]
): Array<
  | { type: "text"; text: string }
  | { type: "image"; image: URL }
  | { type: "file"; data: URL; mimeType: string }
> {
  const content: Array<
    | { type: "text"; text: string }
    | { type: "image"; image: URL }
    | { type: "file"; data: URL; mimeType: string }
  > = []

  // Add text content if present
  if (textContent.trim()) {
    content.push({
      type: "text",
      text: textContent.trim(),
    })
  }

  // Add PDF attachments as files
  pdfAttachments.forEach((attachment) => {
    content.push({
      type: "file",
      data: new URL(attachment.url),
      mimeType: attachment.contentType || "application/pdf",
    })
  })

  // Add image attachments
  imageAttachments.forEach((attachment) => {
    content.push({
      type: "image",
      image: new URL(attachment.url),
    })
  })

  return content
}

/**
 * Processes messages and attachments into the format expected by the AI SDK
 */
function processMessages(messages: Message[], attachments?: FileAttachment[]): CoreMessage[] {
  const formattedMessages: CoreMessage[] = []

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]

    // Skip empty or error messages
    if (!msg.content.trim() || msg.content.startsWith("Sorry, I encountered an error")) {
      continue
    }

    // Check if this is the last user message and has attachments
    const isLastUserMessage = i === messages.length - 1 && msg.role === "user"
    const hasAttachments = attachments && attachments.length > 0

    if (isLastUserMessage && hasAttachments) {
      const imageAttachments = attachments.filter(isImageFile)
      const pdfAttachments = attachments.filter(isPDFFile)

      if (imageAttachments.length > 0 || pdfAttachments.length > 0) {
        // Create multimodal message with text, images, and PDFs
        const content = createMessageContent(msg.content, imageAttachments, pdfAttachments)
        formattedMessages.push({
          role: msg.role,
          content: content,
        } as CoreMessage)
      } else {
        // No supported attachments, just text
        formattedMessages.push({
          role: msg.role,
          content: msg.content.trim(),
        } as CoreMessage)
      }
    } else {
      // Regular text-only message
      formattedMessages.push({
        role: msg.role,
        content: msg.content.trim(),
      } as CoreMessage)
    }
  }

  return formattedMessages
}

export const genAIResponse = createServerFn({ method: "POST", response: "raw" })
  .validator(
    (data: {
      messages: Message[]
      model: string
      chatId: string
      reasoningEffort?: "low" | "medium" | "high"
      search?: boolean
      attachments?: FileAttachment[]
    }) => data
  )
  .middleware([authMiddleware])
  .handler(async ({ data, signal, context }) => {
    const formattedMessages = processMessages(data.messages, data.attachments)

    if (formattedMessages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages to send" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const assistantMessageId = id()

    const model = models.find((model) => model.id === data.model)

    if (!model) {
      return new Response(JSON.stringify({ error: "Model not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    let modelInstance: LanguageModelV1

    const userData = await db.query({
      apiKeys: {
        $: {
          where: {
            provider: model.apiProvider || "",
            user: context.user.id,
          },
          limit: 1,
        },
      },
      preferences: {
        $: {
          where: {
            user: context.user.id,
          },
        },
      },
    })

    let apiKey = userData.apiKeys?.[0]?.key
    let actualApiProvider = model.apiProvider
    let actualProviderId = model.providerId

    if (!apiKey && model.openRouterId) {
      const openRouterData = await db.query({
        apiKeys: {
          $: {
            where: {
              provider: "openrouter",
              user: context.user.id,
            },
            limit: 1,
          },
        },
      })

      if (openRouterData.apiKeys?.[0]?.key) {
        apiKey = openRouterData.apiKeys[0].key
        actualApiProvider = "openrouter"
        actualProviderId = model.openRouterId
      }
    }

    if (!apiKey) {
      db.transact(
        db.tx.messages[assistantMessageId]
          .update({
            error: "Missing or invalid API key",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "failed",
            role: "assistant",
          })
          .link({ chat: data.chatId })
      )
      return new Response(JSON.stringify({ error: "Missing or invalid API key" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const unhashedApiKey = unhash(apiKey)

    switch (actualApiProvider) {
      case "google":
        const google = createGoogleGenerativeAI({ apiKey: unhashedApiKey })
        modelInstance = google(actualProviderId, {
          useSearchGrounding: data.search,
        })
        break
      case "openai":
        const openaiWithKey = createOpenAI({ apiKey: unhashedApiKey })
        modelInstance = openaiWithKey(actualProviderId)
        break
      case "anthropic":
        const anthropicWithKey = createAnthropic({ apiKey: unhashedApiKey })
        modelInstance = anthropicWithKey(actualProviderId, {
          ...(model.abilities?.reasoning ? { sendReasoning: true } : {}),
        })
        break
      case "openrouter":
        const openrouterWithKey = createOpenRouter({ apiKey: unhashedApiKey })
        modelInstance = openrouterWithKey(actualProviderId, {
          reasoning: {
            effort: data.reasoningEffort || "medium",
          },
        })
        break
      default:
        return new Response(JSON.stringify({ error: "Unsupported model provider" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
    }

    const startTime = Date.now()

    const result = streamText({
      model: modelInstance!,
      messages: formattedMessages,
      system: promptBuilder(
        userData.preferences?.[0]?.name,
        userData.preferences?.[0]?.traits,
        userData.preferences?.[0]?.what_do_you_do,
        userData.preferences?.[0]?.knowledge
      ),
      abortSignal: signal,

      ...(actualApiProvider === "anthropic" && {
        providerOptions: {
          anthropic: {
            thinking: model.abilities?.reasoning
              ? {
                  type: "enabled",
                  budgetTokens:
                    data.reasoningEffort === "high"
                      ? 80000
                      : data.reasoningEffort === "low"
                        ? 20000
                        : 50000,
                }
              : { type: "disabled" },
          } satisfies AnthropicProviderOptions,
        },
      }),

      ...(actualApiProvider === "openai" &&
        model.abilities?.reasoning && {
          providerOptions: {
            openai: {
              reasoningSummary: "auto",
              reasoningEffort: data.reasoningEffort || "medium",
            },
          },
        }),

      ...(actualApiProvider === "google" && {
        providerOptions: {
          google: {
            thinkingConfig: {
              includeThoughts: model.abilities?.reasoning || false,
            },
          } satisfies GoogleGenerativeAIProviderOptions,
        },
      }),

      onError: (event) => {
        const error = event.error as APICallError
        const errorMessage =
          error?.statusCode === 401
            ? "Missing or invalid API key."
            : error.message || "An error occurred"

        db.transact(
          db.tx.messages[assistantMessageId]
            .update({
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              status: "failed",
              error: errorMessage,
              role: "assistant",
              model: data.model,
            })
            .link({ chat: data.chatId })
        )
      },

      onFinish: async (message) => {
        const googleMetadata = message.providerMetadata?.google as
          | GoogleGenerativeAIProviderMetadata
          | undefined
        const groundingMetadata = googleMetadata?.groundingMetadata

        const requestDuration = Date.now() - startTime
        await db.transact(
          db.tx.messages[assistantMessageId]
            .update({
              status: signal?.aborted ? "cancelled" : "completed",
              content: message.text,
              thinking_text: message.reasoning,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              role: "assistant",
              model: data.model,
              grounding_data: groundingMetadata,
              tokens_used: message.usage.totalTokens,
              tokens_per_second: message.usage.totalTokens / (requestDuration / 1000),
              request_duration_ms: requestDuration,
            })
            .link({ chat: data.chatId })
        )

        await db.transact(
          db.tx.usage[context.user.id]
            .update({
              premium: model.premium
                ? ((await db.query({ usage: { $: { where: { user: context.user.id } } } }))
                    .usage?.[0]?.premium || 0) + 1
                : ((await db.query({ usage: { $: { where: { user: context.user.id } } } }))
                    .usage?.[0]?.standard || 0) + 1,
            })
            .link({ user: context.user.id })
        )

        await db.transact(
          db.tx.chats[data.chatId].update({
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        )
      },
    })

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
      getErrorMessage: (error: unknown) => {
        if (error instanceof APICallError) {
          if (error.statusCode === 401) {
            return "Missing or invalid API key."
          }
          if (error.statusCode === 404) {
            return "The model you are trying to use is not available."
          }
        }
        return "An error occurred while generating a response"
      },
    })
  })
