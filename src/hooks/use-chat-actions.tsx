import { useState, useEffect, useRef } from "react"
import { useServerFn } from "@tanstack/react-start"
import { id } from "@instantdb/react"
import { db } from "@/utils/instant"
import { Model, models } from "@/lib/ai/models"
import { genAIResponse, type Message, type FileAttachment } from "@/lib/ai/generate"
import { processStreamResponse } from "@/utils/stream"
import { uploadFilesToStorage, getMessageFiles } from "@/lib/chat/file-utils"
import { useChatStream } from "@/contexts/chat-stream-context"

interface UseChatActionsProps {
  chatId?: string
  data: any
  model: Model
  isSearchEnabled: boolean
  preSubmit?: (input: string, model: string) => Promise<string | void> | string | void
  fileUpload: {
    selectedFiles: File[]
    setUploadingFiles: (uploading: boolean) => void
    clearFiles: () => void
  }
}

export function useChatActions({
  chatId,
  data,
  model,
  isSearchEnabled,
  preSubmit,
  fileUpload,
}: UseChatActionsProps) {
  const {
    streamingMessage,
    isStreaming,
    controllerRef,
    setStreamingMessage,
    setIsStreaming,
    cleanupStream,
    createNewController,
  } = useChatStream()

  const [optimisticMessage, setOptimisticMessage] = useState<Message | null>(null)
  const previousChatIdRef = useRef<string | undefined>(chatId)

  const generateFn = useServerFn(genAIResponse)
  const { user } = db.useAuth()

  useEffect(() => {
    const previousChatId = previousChatIdRef.current
    const currentChatId = chatId

    const shouldReset = previousChatId && currentChatId && previousChatId !== currentChatId

    if (shouldReset) {
      setOptimisticMessage(null)
    }

    previousChatIdRef.current = chatId
  }, [chatId])

  const handleAIResponse = async (
    input: string,
    selectedModel: Model,
    isRetry: boolean = false,
    userMessageFiles: FileAttachment[] = [],
    messageIdOverride?: string
  ) => {
    const hasValidInput = input.trim() || fileUpload.selectedFiles.length > 0
    if (!hasValidInput || isStreaming) return

    createNewController()

    let currentChatId = chatId
    if (preSubmit && !isRetry && !chatId) {
      const result = await preSubmit(input, selectedModel.id)
      if (typeof result === "string") {
        currentChatId = result
      }
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: input.trim(),
      model: selectedModel.id,
      reasoning: "",
    }

    const messages: Message[] = (data?.messages || []).map((msg: any) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content || "",
      model: msg.model || "",
      reasoning: msg.thinking_text || "",
      grounding_data: msg.grounding_data,
    }))

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      model: selectedModel.id,
      reasoning: "",
    }

    setStreamingMessage(assistantMessage)
    setIsStreaming(true)

    let uploadedAttachments: FileAttachment[] = []

    try {
      if (!isRetry) {
        fileUpload.setUploadingFiles(true)

        const userMessageId = messageIdOverride || id()
        await db.transact([
          db.tx.messages[userMessageId]
            .update({
              content: input,
              role: "user",
              status: "completed",
              model: selectedModel.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .link({ chat: currentChatId }),
        ])

        if (fileUpload.selectedFiles.length > 0) {
          try {
            uploadedAttachments = await uploadFilesToStorage(
              fileUpload.selectedFiles,
              userMessageId,
              user!.id
            )

            await db.transact(
              uploadedAttachments.map((attachment) =>
                db.tx.messages[userMessageId].link({ $files: attachment.id })
              )
            )
          } catch (error) {
            console.error("Failed to upload files:", error)
          }
        }

        fileUpload.setUploadingFiles(false)
        fileUpload.clearFiles()
      }

      const allAttachments = uploadedAttachments.concat(userMessageFiles)
      const response = await generateFn({
        data: {
          messages: [...messages, userMessage],
          model: selectedModel.id,
          chatId: currentChatId!,
          search: isSearchEnabled,
          ...(allAttachments.length > 0 && {
            attachments: allAttachments,
          }),
        },
        signal: controllerRef.current?.signal,
      })

      if (response.body) {
        await processStreamResponse(response, async (content, reasoning, error) => {
          setStreamingMessage((prev) =>
            prev
              ? {
                  ...prev,
                  content,
                  reasoning: reasoning,
                  error: error,
                }
              : null
          )
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error during AI response:", error)
        setStreamingMessage((prev) =>
          prev
            ? {
                ...prev,
                error: error instanceof Error ? error.message : "An error occurred",
              }
            : null
        )
      }
    } finally {
      if (controllerRef.current && !controllerRef.current.signal.aborted) {
        setStreamingMessage(null)
        setIsStreaming(false)
      }
      fileUpload.setUploadingFiles(false)
    }
  }

  const handleChatSubmit = async (
    input: string,
    setInput: (input: string) => void,
    e?: { preventDefault?: () => void }
  ) => {
    e?.preventDefault?.()
    const hasValidInput = input.trim() || fileUpload.selectedFiles.length > 0
    if (!hasValidInput || isStreaming) return

    const messageId = id()
    const optimisticMsg: Message = {
      id: messageId,
      role: "user",
      content: input.trim(),
      model: model.id,
      reasoning: "",
    }
    setOptimisticMessage(optimisticMsg)

    const currentInput = input
    setInput("")
    await handleAIResponse(currentInput, model, false, [], messageId)
  }

  const retryMessage = (messagesForRendering: Message[], modelId?: string, messageId?: string) => {
    if (!messageId) return

    const messageIndex = messagesForRendering.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1) return
    const modelToUse = modelId
      ? models.find((m) => m.id === modelId) || model
      : models.find((m) => m.id === messagesForRendering[messageIndex].model) || model

    const message = messagesForRendering[messageIndex]

    if (message.role === "user") {
      const messagesToDelete = messagesForRendering.slice(messageIndex + 1)
      if (messagesToDelete.length > 0) {
        db.transact(messagesToDelete.map((msg) => db.tx.messages[msg.id].delete()))
      }
      const userMessageFiles = getMessageFiles(data?.messages.find((m: any) => m.id === message.id))
      handleAIResponse(message.content, modelToUse, true, userMessageFiles)
      return
    }

    const userMessageIndex = messageIndex - 1
    if (userMessageIndex < 0) return

    const userMessage = messagesForRendering[userMessageIndex]
    if (userMessage.role !== "user") return

    const messagesToDelete = messagesForRendering.slice(messageIndex)

    if (messagesToDelete.length > 0) {
      db.transact(messagesToDelete.map((msg) => db.tx.messages[msg.id].delete()))
    }

    const userMessageFiles = getMessageFiles(
      data?.messages.find((m: any) => m.id === userMessage.id)
    )
    handleAIResponse(userMessage.content, modelToUse, true, userMessageFiles)
  }

  const editMessage = async (
    messagesForRendering: Message[],
    messageId: string,
    newContent: string
  ) => {
    const messageIndex = messagesForRendering.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1) return

    const message = messagesForRendering[messageIndex]
    if (message.role !== "user") return

    await db.transact([
      db.tx.messages[messageId].update({
        content: newContent,
        updated_at: new Date().toISOString(),
      }),
    ])

    const messagesToDelete = messagesForRendering.slice(messageIndex + 1)
    if (messagesToDelete.length > 0) {
      await db.transact(messagesToDelete.map((msg) => db.tx.messages[msg.id].delete()))
    }

    const userMessageFiles = getMessageFiles(data?.messages.find((m: any) => m.id === messageId))
    await handleAIResponse(newContent, model, true, userMessageFiles)
  }

  const stopStreaming = () => {
    cleanupStream()
  }

  return {
    streamingMessage,
    isStreaming,
    optimisticMessage,
    setOptimisticMessage,
    handleChatSubmit,
    retryMessage,
    editMessage,
    stopStreaming,
  }
}
