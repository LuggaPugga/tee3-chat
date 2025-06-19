import type React from "react"

import { useRef, useMemo, useCallback } from "react"
import SubmitButton from "./submit-button"
import { models } from "@/lib/ai/models"
import SearchButton, { ReasoningEffortButton, AttachButton } from "./input-features"
import ModelSelect from "./model-select"

export default function ChatInput({
  handleSubmit,
  input,
  setInput,
  stop,
  status,
  model,
  reasoningEffort,
  setReasoningEffort,
  setModel,
  isSearchEnabled,
  setIsSearchEnabled,
  selectedFiles,
  onFilesSelected,
  onFileRemove,
}: {
  handleSubmit: (e: React.FormEvent) => void
  input: string
  setInput: (input: string) => void
  stop: () => void
  status: "error" | "streaming" | "ready" | "submitted"
  model: (typeof models)[0]
  reasoningEffort: "low" | "medium" | "high"
  setReasoningEffort: (reasoningEffort: "low" | "medium" | "high") => void
  setModel: (model: (typeof models)[0]) => void
  isSearchEnabled: boolean
  setIsSearchEnabled: (isSearchEnabled: boolean) => void
  selectedFiles?: File[]
  onFilesSelected?: (files: File[]) => void
  onFileRemove?: (index: number) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const selectedModel = model

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    },
    [handleSubmit]
  )

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)

      const textarea = e.target
      textarea.style.height = "48px"
      const scrollHeight = textarea.scrollHeight

      if (!e.target.value.trim()) {
        textarea.style.height = "48px"
      } else {
        textarea.style.height = Math.min(scrollHeight, 200) + "px"
      }
    },
    [setInput]
  )

  const memoizedModelSelect = useMemo(
    () => <ModelSelect model={selectedModel} setModel={setModel} selectedModel={selectedModel} />,
    [selectedModel, setModel]
  )

  return (
    <div className="fixed bottom-0 w-full max-w-3xl">
      <div className="pointer-events-auto">
        <div
          className="border-reflect rounded-t-[20px] bg-chat-input-background p-2 pb-0 backdrop-blur-lg ![--c:--chat-input-gradient]"
          style={
            {
              "--gradientBorder-gradient":
                "linear-gradient(180deg, var(--min), var(--max), var(--min)), linear-gradient(15deg, var(--min) 50%, var(--max))",
              "--start": "#000000e0",
              "--opacity": "1",
            } as React.CSSProperties
          }
        >
          <form
            onSubmit={handleSubmit}
            className="relative flex w-full flex-col items-stretch gap-2 rounded-t-xl border border-b-0 border-white/70 bg-[--chat-input-background] px-3 pt-3 text-secondary-foreground outline-8 outline-chat-input-gradient/50 pb-3 max-sm:pb-6 sm:max-w-3xl dark:border-[hsl(0,0%,83%)]/[0.04] dark:bg-secondary/[0.045] dark:outline-chat-background/40"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.1) 0px 80px 50px 0px, rgba(0, 0, 0, 0.07) 0px 50px 30px 0px, rgba(0, 0, 0, 0.06) 0px 30px 15px 0px, rgba(0, 0, 0, 0.04) 0px 15px 8px, rgba(0, 0, 0, 0.04) 0px 6px 4px, rgba(0, 0, 0, 0.02) 0px 2px 2px",
            }}
          >
            {/* File previews */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 text-sm"
                  >
                    <span className="truncate max-w-32">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    {onFileRemove && (
                      <button
                        type="button"
                        onClick={() => onFileRemove(index)}
                        className="text-muted-foreground hover:text-foreground ml-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-grow flex-col">
              <div></div>
              <div className="flex flex-grow flex-row items-start">
                <textarea
                  ref={textareaRef}
                  name="input"
                  id="chat-input"
                  placeholder="Type your message here..."
                  className="w-full resize-none bg-transparent text-base leading-6 text-foreground outline-none placeholder:text-secondary-foreground/60 disabled:opacity-0"
                  aria-label="Message input"
                  aria-describedby="chat-input-description"
                  autoComplete="off"
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  style={{ height: "48px" }}
                  autoFocus
                />
                <div id="chat-input-description" className="sr-only">
                  Press Enter to send, Shift + Enter for new line
                </div>
              </div>
              <div className="-mb-px mt-2 flex w-full flex-row-reverse justify-between">
                <div
                  className="-mr-0.5 -mt-0.5 flex items-center justify-center gap-2"
                  aria-label="Message actions"
                >
                  <SubmitButton
                    onClick={status === "streaming" ? stop : handleSubmit}
                    streaming={status === "streaming"}
                    disabled={
                      !input.trim() &&
                      (!selectedFiles || selectedFiles.length === 0) &&
                      status === "ready"
                    }
                  />
                </div>

                <div className="flex flex-col gap-2 pr-2 sm:flex-row sm:items-center">
                  <div className="ml-[-7px] flex items-center gap-1">
                    {memoizedModelSelect}
                    {selectedModel.abilities?.search && (
                      <SearchButton
                        isSearchEnabled={isSearchEnabled}
                        setIsSearchEnabled={setIsSearchEnabled}
                      />
                    )}
                    {selectedModel.abilities?.effort_control && (
                      <ReasoningEffortButton
                        reasoningEffort={reasoningEffort}
                        setReasoningEffort={setReasoningEffort}
                      />
                    )}
                    <AttachButton onFilesSelected={onFilesSelected} selectedFiles={selectedFiles} />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
