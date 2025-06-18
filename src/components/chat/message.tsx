import { getModelName } from "@/lib/ai/models"
import { branchChat } from "@/lib/ai/branch-chat"
import { useServerFn } from "@tanstack/react-start"
import { useNavigate } from "@tanstack/react-router"
import { Message } from "@/lib/ai/generate"
import { ReasoningSummary } from "./reasoning-summary"
import { MemoizedMarkdown } from "./memoized-markdown"
import { AssistantActions, UserActions } from "./actions"
import { Download, FileText } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { GroundingDetails } from "./grounding-details"
import ChatError from "./chat-error"

interface FileAttachment {
  id: string
  path: string
  url: string
}

interface ChatMessageProps {
  message: Message
  chatId: string
  retryMessage: (modelId?: string, messageId?: string) => void
  editMessage?: (messageId: string, newContent: string) => void
  files?: FileAttachment[]
}

/**
 * Component for displaying individual file attachments
 */
function FileDisplay({ file }: { file: FileAttachment }) {
  const fileName = file.path.split("/").pop() || file.path
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.path)

  if (isImage) {
    return (
      <div className="group relative">
        <div>
          <img
            alt="Attached image"
            className="max-h-[300px] cursor-pointer rounded-lg object-contain"
            src={file.url}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-secondary-foreground/10 max-w-xs">
      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="text-sm truncate flex-1">{fileName}</span>
      <a
        href={file.url}
        download={fileName}
        className="p-1 hover:bg-secondary rounded"
        title="Download file"
      >
        <Download className="h-3 w-3 text-muted-foreground" />
      </a>
    </div>
  )
}

export default function ChatMessage({
  message,
  chatId,
  retryMessage,
  editMessage,
  files = [],
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const navigate = useNavigate()
  const branchChatFn = useServerFn(branchChat)
  const modelName = getModelName(message.model) || ""

  const hasContent = message.content !== ""
  const hasReasoning = message.reasoning && message.reasoning !== ""
  const hasFiles = files.length > 0
  const hasError = message.error && message.error !== ""

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 400) + "px"
    }
  }, [isEditing, editContent])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [isEditing])

  const handleEditSubmit = () => {
    if (editContent.trim() !== message.content && editMessage) {
      editMessage(message.id, editContent.trim())
    }
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setEditContent(message.content)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      handleEditSubmit()
    } else if (e.key === "Escape") {
      handleEditCancel()
    }
  }

  if (!hasContent && !hasFiles && !hasReasoning && !hasError) return null

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex flex-col ${message.role === "user" ? "justify-start items-end" : "justify-start items-start"}`}
      >
        {hasReasoning && (
          <div className="flex flex-col justify-start items-start">
            <ReasoningSummary content={message.reasoning || ""} />
          </div>
        )}

        {message.error && (
          <div className="flex flex-col justify-start items-center w-full">
            <ChatError error={message.error} />
          </div>
        )}

        {(hasContent || hasFiles) && (
          <div
            role="article"
            aria-label={`${message.role === "user" ? "Your" : "Assistant"} message`}
            className={`group relative break-words rounded-xl ${
              message.role === "user"
                ? isEditing
                  ? "border px-4 py-3 text-left w-full border-chat-border/70 bg-gradient-noise-top/50 shadow-[inset_0px_4px_6px_#000] shadow-foreground/10 dark:border-foreground/5 dark:shadow-black/20"
                  : "inline-block max-w-full bg-secondary/50 px-4 py-3 ml-auto"
                : "w-full px-1"
            }`}
          >
            <span className="sr-only">
              {message.role === "user" ? "Your" : "Assistant"} message:{" "}
            </span>
            <div className="flex flex-col gap-3">
              {hasContent && (
                <div className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                  {isEditing && message.role === "user" ? (
                    <>
                      <textarea
                        ref={textareaRef}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your message... (Ctrl+Enter to save, Escape to cancel)"
                        className="w-full resize-none overflow-hidden border-none bg-transparent px-0 py-0 text-base leading-6 text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                        style={{
                          minHeight: "24px",
                          maxHeight: "400px",
                          overflowY: "auto",
                        }}
                      />
                    </>
                  ) : (
                    <MemoizedMarkdown content={message.content} id={message.id} />
                  )}
                </div>
              )}
              {hasFiles && (
                <>
                  {files.map((file) => (
                    <FileDisplay key={file.id} file={file} />
                  ))}
                </>
              )}
            </div>

            {/* Action buttons */}
            {message.grounding_data &&
              message.grounding_data.groundingSupports &&
              message.grounding_data.groundingSupports.length > 0 && (
                <div className="flex flex-col justify-start items-start">
                  <GroundingDetails data={message.grounding_data} />
                </div>
              )}
            <div
              className={`absolute ${isEditing ? "mt-5" : "mt-3"} flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100 ${
                message.role === "user" ? "right-0" : "left-0"
              }`}
            >
              {message.role === "user" && (
                <UserActions
                  copyToClipboard={() => {
                    navigator.clipboard.writeText(message.content)
                  }}
                  retryMessage={(modelId?: string) => {
                    retryMessage(modelId, message.id)
                  }}
                  editMessage={() => {
                    if (isEditing) {
                      handleEditCancel()
                    } else {
                      setIsEditing(true)
                    }
                  }}
                />
              )}
              {message.role === "assistant" && (
                <AssistantActions
                  model={modelName}
                  copyToClipboard={() => {
                    navigator.clipboard.writeText(message.content)
                  }}
                  branchChat={async () => {
                    const newChatId = await branchChatFn({
                      data: { id: chatId, messageId: message.id },
                    })
                    navigate({ to: `/chat/${newChatId}` })
                  }}
                  retryMessage={(modelId?: string) => {
                    retryMessage(modelId, message.id)
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
