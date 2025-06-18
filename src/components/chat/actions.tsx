import { Check, Edit, GitBranch, RefreshCcw } from "lucide-react"
import { Copy } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import RetryDropdown from "./retry-dropdown"

export function AssistantActions({
  model,
  copyToClipboard,
  branchChat,
  retryMessage,
}: {
  model: string
  copyToClipboard: () => void
  branchChat: () => void
  retryMessage: (modelId?: string) => void
}) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="items-center gap-1 flex">
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-muted/40 hover:text-foreground text-xs h-8 w-8 rounded-lg p-0"
        aria-label="Copy message"
        onClick={() => {
          setCopied(true)
          copyToClipboard()
          setTimeout(() => setCopied(false), 1500)
        }}
      >
        <div className="relative h-4 w-4">
          <Check
            className={`absolute h-4 w-4 transition-all duration-100 ease-[cubic-bezier(0.2,0.4,0.1,0.95)] ${
              copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          <Copy
            className={`absolute h-4 w-4 transition-all duration-100 ease-[cubic-bezier(0.2,0.4,0.1,0.95)] ${
              copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
          />
        </div>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-muted/40 hover:text-foreground text-xs h-8 w-8 rounded-lg p-0"
        aria-label="Branch chat"
        onClick={() => {
          branchChat()
        }}
      >
        <GitBranch className="h-4 w-4" />
      </Button>

      <RetryDropdown
        retry={(modelId?: string) => {
          retryMessage(modelId)
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-muted/40 hover:text-foreground text-xs h-8 w-8 rounded-lg p-0"
          aria-label="Retry message"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </RetryDropdown>
      <p className="text-xs text-muted-foreground whitespace-nowrap">{model}</p>
    </div>
  )
}

export function UserActions({
  copyToClipboard,
  retryMessage,
  editMessage,
}: {
  copyToClipboard: () => void
  retryMessage: (modelId?: string) => void
  editMessage: () => void
}) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="items-center gap-1 flex mt-2">
      <RetryDropdown
        retry={(modelId?: string) => {
          retryMessage(modelId)
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-muted/40 hover:text-foreground text-xs h-8 w-8 rounded-lg p-0"
          aria-label="Retry message"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </RetryDropdown>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-muted/40 hover:text-foreground text-xs h-8 w-8 rounded-lg p-0"
        aria-label="Edit message"
        onClick={() => {
          editMessage()
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-muted/40 hover:text-foreground text-xs h-8 w-8 rounded-lg p-0"
        aria-label="Copy message"
        onClick={() => {
          setCopied(true)
          copyToClipboard()
          setTimeout(() => setCopied(false), 1500)
        }}
      >
        <div className="relative h-4 w-4">
          <Check
            className={`absolute h-4 w-4 transition-all duration-100 ease-[cubic-bezier(0.2,0.4,0.1,0.95)] ${
              copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          <Copy
            className={`absolute h-4 w-4 transition-all duration-100 ease-[cubic-bezier(0.2,0.4,0.1,0.95)] ${
              copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
          />
        </div>
      </Button>
    </div>
  )
}
