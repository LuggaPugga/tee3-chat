"use client"

import { useState, useEffect } from "react"
import { Model, models } from "@/lib/ai/models"
import { type Message } from "@/lib/ai/generate"
import { InstaQLParams } from "@instantdb/react"
import { db } from "@/utils/instant"
import { AppSchema } from "instant.schema"
import ChatInput from "./input"
import FileDrop from "./file-drop"
import ChatMessages from "./chat-messages"
import ScrollToBottom from "./scroll-to-bottom"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop"
import { useScrollBehavior } from "@/hooks/use-scroll-behavior"
import { useChatActions } from "@/hooks/use-chat-actions"
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES } from "@/lib/chat/file-utils"

interface ChatProps {
  chatId?: string
  preSubmit?: (input: string, model: string) => Promise<string | void> | string | void
  className?: string
  initialMessage?: string
}

const getLastSelectedModel = (): Model => {
  if (typeof window !== "undefined") {
    const savedModelId = localStorage.getItem("lastSelectedModel")
    if (savedModelId) {
      const savedModel = models.find((m) => m.id === savedModelId)
      if (savedModel) return savedModel
    }
  }
  return models[1]
}

const saveLastSelectedModel = (modelId: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("lastSelectedModel", modelId)
  }
}

export default function Chat({ chatId, preSubmit, initialMessage }: ChatProps) {
  const [model, setModel] = useState<Model>(() => {
    if (typeof window !== "undefined" && !chatId) {
      return getLastSelectedModel()
    }
    return models[1]
  })
  const [reasoningEffort, setReasoningEffort] = useState<"low" | "medium" | "high">("low")
  const [isSearchEnabled, setIsSearchEnabled] = useState(false)
  const [input, setInput] = useState("")
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false)

  const fileUpload = useFileUpload()
  const { showDropOverlay } = useDragAndDrop(fileUpload.addFiles)
  const { showScrollButton, scrollToBottom, checkScrollPosition, handleInitialScroll } =
    useScrollBehavior(chatId)

  const query = {
    messages: {
      $: {
        where: { chat: chatId || "" },
      },
      $files: {},
    },
    ...(chatId && {
      chats: {
        $: {
          where: { id: chatId },
        },
      },
    }),
  } satisfies InstaQLParams<AppSchema>
  const { isLoading, data } = db.useQuery(query)

  useEffect(() => {
    if (chatId && data?.chats?.[0]?.model) {
      const chatModel = models.find((m) => m.id === data.chats![0].model)
      if (chatModel && chatModel.id !== model.id) {
        setModel(chatModel)
      }
    } else if (!chatId) {
      const lastModel = getLastSelectedModel()
      if (lastModel.id !== model.id) {
        setModel(lastModel)
      }
    }
  }, [chatId, data?.chats, model.id])

  const handleModelChange = async (newModel: Model) => {
    setModel(newModel)
    saveLastSelectedModel(newModel.id)

    if (chatId) {
      await db.transact([
        db.tx.chats[chatId].update({
          model: newModel.id,
          updated_at: new Date().toISOString(),
        }),
      ])
    }
  }

  const chatActions = useChatActions({
    chatId,
    data,
    model,
    isSearchEnabled,
    preSubmit,
    fileUpload,
  })

  const messagesForRendering: Message[] = (data?.messages || []).map((msg: any) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content || "",
    model: msg.model || "",
    reasoning: msg.thinking_text || "",
    grounding_data: msg.grounding_data,
    error: msg.error,
  }))

  const hasContent = Boolean(
    messagesForRendering.length > 0 ||
      input.trim() ||
      chatActions.isStreaming ||
      fileUpload.selectedFiles.length > 0
  )

  useEffect(() => {
    if (!isLoading && messagesForRendering.length > 0) {
      handleInitialScroll(true)
    }
  }, [messagesForRendering.length, handleInitialScroll, isLoading, chatId])

  useEffect(() => {
    if (!isLoading) {
      checkScrollPosition()
    }
  }, [
    messagesForRendering,
    chatActions.streamingMessage,
    chatActions.optimisticMessage,
    checkScrollPosition,
    isLoading,
  ])

  useEffect(() => {
    if (
      chatActions.optimisticMessage &&
      messagesForRendering.some((msg) => msg.id === chatActions.optimisticMessage?.id)
    ) {
      chatActions.setOptimisticMessage(null)
    }
  }, [messagesForRendering, chatActions.optimisticMessage, chatActions.setOptimisticMessage])

  useEffect(() => {
    if (initialMessage && !hasAutoSubmitted && chatId && !isLoading && !chatActions.isStreaming) {
      setHasAutoSubmitted(true)
      chatActions.handleChatSubmit(initialMessage, () => {})
    }
  }, [
    initialMessage,
    hasAutoSubmitted,
    chatId,
    isLoading,
    chatActions.isStreaming,
    chatActions.handleChatSubmit,
  ])

  const handleChatSubmit = (e?: { preventDefault?: () => void }) => {
    const hasValidInput = input.trim() || fileUpload.selectedFiles.length > 0
    if (!hasValidInput || isLoading || chatActions.isStreaming || fileUpload.uploadingFiles) return

    chatActions.handleChatSubmit(input, setInput, e)
  }

  const handleRetryMessage = (modelId?: string, messageId?: string) => {
    chatActions.retryMessage(messagesForRendering, modelId, messageId)
  }

  const handleEditMessage = (messageId: string, newContent: string) => {
    chatActions.editMessage(messagesForRendering, messageId, newContent)
  }

  return (
    <>
      <FileDrop
        onFilesDrop={fileUpload.addFiles}
        onClose={() => fileUpload.toggleFileDrop(false)}
        acceptedFileTypes={ACCEPTED_FILE_TYPES}
        maxFileSize={MAX_FILE_SIZE}
        maxFiles={MAX_FILES}
        isVisible={fileUpload.showFileDrop || showDropOverlay}
        selectedFiles={fileUpload.selectedFiles}
      />

      <ChatMessages
        messages={messagesForRendering}
        hasContent={hasContent}
        optimisticMessage={chatActions.optimisticMessage}
        isStreaming={chatActions.isStreaming}
        streamingMessage={chatActions.streamingMessage}
        data={data}
        chatId={chatId || ""}
        setInput={setInput}
        retryMessage={handleRetryMessage}
        editMessage={handleEditMessage}
      />

      <ScrollToBottom isVisible={showScrollButton} onClick={scrollToBottom} />

      <div className="flex justify-center pb-4">
        <ChatInput
          handleSubmit={handleChatSubmit}
          input={input}
          setInput={setInput}
          stop={chatActions.stopStreaming}
          status={
            chatActions.isStreaming
              ? "streaming"
              : fileUpload.uploadingFiles
                ? "submitted"
                : "ready"
          }
          model={model}
          setModel={handleModelChange}
          reasoningEffort={reasoningEffort}
          setReasoningEffort={setReasoningEffort}
          isSearchEnabled={isSearchEnabled}
          setIsSearchEnabled={setIsSearchEnabled}
          selectedFiles={fileUpload.selectedFiles}
          onFilesSelected={fileUpload.addFiles}
          onFileRemove={fileUpload.removeFile}
        />
      </div>
    </>
  )
}
