import React, { createContext, useContext, useRef, useState } from "react"
import { type Message } from "@/lib/ai/generate"

interface ChatStreamContextType {
  streamingMessage: Message | null
  isStreaming: boolean
  controllerRef: React.MutableRefObject<AbortController | null>
  setStreamingMessage: React.Dispatch<React.SetStateAction<Message | null>>
  setIsStreaming: (streaming: boolean) => void
  cleanupStream: () => void
  createNewController: () => void
}

const ChatStreamContext = createContext<ChatStreamContextType | undefined>(undefined)

export function ChatStreamProvider({ children }: { children: React.ReactNode }) {
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  const cleanupStream = () => {
    if (controllerRef.current) {
      controllerRef.current.abort()
      controllerRef.current = null
    }
    setStreamingMessage(null)
    setIsStreaming(false)
  }

  const createNewController = () => {
    cleanupStream()
    controllerRef.current = new AbortController()
  }

  return (
    <ChatStreamContext.Provider
      value={{
        streamingMessage,
        isStreaming,
        controllerRef,
        setStreamingMessage,
        setIsStreaming,
        cleanupStream,
        createNewController,
      }}
    >
      {children}
    </ChatStreamContext.Provider>
  )
}

export function useChatStream() {
  const context = useContext(ChatStreamContext)
  if (context === undefined) {
    throw new Error("useChatStream must be used within a ChatStreamProvider")
  }
  return context
}
