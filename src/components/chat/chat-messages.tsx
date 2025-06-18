import { Message } from "@/lib/ai/generate"
import ChatMessage from "./message"
import EmptyChat from "./empty-chat"
import Loading from "./loading"
import CancelledChat from "./cancelled-chat"

interface ChatMessagesProps {
  messages: Message[]
  hasContent: boolean
  optimisticMessage: Message | null
  isStreaming: boolean
  streamingMessage: Message | null
  data: any
  chatId: string
  setInput: (input: string) => void
  retryMessage: (modelId?: string, messageId?: string) => void
  editMessage: (messageId: string, newContent: string) => void
}

export default function ChatMessages({
  messages,
  hasContent,
  optimisticMessage,
  isStreaming,
  streamingMessage,
  data,
  chatId,
  setInput,
  retryMessage,
  editMessage,
}: ChatMessagesProps) {
  const allMessages =
    isStreaming && streamingMessage
      ? [...messages.filter((msg) => msg.content !== streamingMessage.content), streamingMessage]
      : messages

  if (optimisticMessage && !messages.some((m) => m.id === optimisticMessage.id)) {
    allMessages.push(optimisticMessage)
  }

  return (
    <div className="space-y-12 pb-[144px]">
      {!hasContent && !optimisticMessage && <EmptyChat setPrompt={setInput} />}

      {allMessages.map((message) => {
        const messageFiles =
          data?.messages
            .find((m: any) => m.id === message.id)
            ?.$files?.map((file: any) => ({
              id: file.id,
              path: file.path,
              url: file.url,
            })) || []

        if (
          isStreaming &&
          message.role === "assistant" &&
          !message.content &&
          !message.reasoning &&
          !message.error
        ) {
          return (
            <div key={message.id} className="group relative max-w-full">
              <Loading />
            </div>
          )
        }

        return (
          <ChatMessage
            key={message.id}
            message={message}
            chatId={chatId}
            retryMessage={retryMessage}
            editMessage={editMessage}
            files={messageFiles}
          />
        )
      })}

      {messages.some(
        (message) =>
          message.role === "assistant" &&
          data?.messages.some((m: any) => m.id === message.id && m.status === "cancelled")
      ) && <CancelledChat />}
    </div>
  )
}
