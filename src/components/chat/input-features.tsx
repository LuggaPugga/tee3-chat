import { Brain, Globe, Paperclip } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useRef } from "react"
import { Button } from "../ui/button"

export default function SearchButton({
  isSearchEnabled,
  setIsSearchEnabled,
}: {
  isSearchEnabled: boolean
  setIsSearchEnabled: (isSearchEnabled: boolean) => void
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`-mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 px-2 py-1.5 pr-2.5 text-xs text-muted-foreground cursor-pointer max-sm:p-2 ${
        isSearchEnabled ? "!bg-pink-500/15" : ""
      }`}
      onClick={() => setIsSearchEnabled(!isSearchEnabled)}
    >
      <Globe className="h-4 w-4 scale-x-[-1]" />
      <span className="max-sm:hidden">Search</span>
    </Button>
  )
}

export function ReasoningEffortButton({
  reasoningEffort,
  setReasoningEffort,
}: {
  reasoningEffort: "low" | "medium" | "high"
  setReasoningEffort: (reasoningEffort: "low" | "medium" | "high") => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`-mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 px-2 py-1.5 pr-2.5 text-xs text-muted-foreground cursor-pointer max-sm:p-2`}
        >
          <Brain className="h-4 w-4 scale-x-[-1]" />
          <span className="max-sm:hidden capitalize">{reasoningEffort}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-none">
        <DropdownMenuItem onClick={() => setReasoningEffort("low")}>
          <Brain className="h-4 w-4 scale-x-[-1] text-white" /> Low
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setReasoningEffort("medium")}>
          <Brain className="h-4 w-4 scale-x-[-1] text-white" /> Medium
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setReasoningEffort("high")}>
          <Brain className="h-4 w-4 scale-x-[-1] text-white" /> High
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AttachButton({
  onFilesSelected,
  selectedFiles,
}: {
  onFilesSelected?: (files: File[]) => void
  selectedFiles?: File[]
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    console.debug("[FileUpload] Attach button clicked")
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files)
    }
  }

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept=".txt,.md,.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`-mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 px-2 py-1.5 pr-2.5 text-xs text-muted-foreground cursor-pointer max-sm:p-2 ${
          selectedFiles && selectedFiles.length > 0 ? "!bg-blue-500/15" : ""
        }`}
        onClick={handleButtonClick}
      >
        <Paperclip className="h-4 w-4 scale-x-[-1]" />
        <span className="max-sm:hidden">
          Attach{selectedFiles && selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ""}
        </span>
      </Button>
    </>
  )
}
