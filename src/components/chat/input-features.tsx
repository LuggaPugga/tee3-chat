import { Brain, Globe, Paperclip } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useRef } from "react"
import { Button } from "../ui/button"

import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"

export default function SearchButton({
  isSearchEnabled,
  setIsSearchEnabled,
}: {
  isSearchEnabled: boolean
  setIsSearchEnabled: (isSearchEnabled: boolean) => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent sideOffset={5}>Enable search grounding</TooltipContent>
    </Tooltip>
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
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent sideOffset={5}>Reasoning Effort</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="border-none [&_svg]:text-white [&_svg]:size-4 [&_svg]:scale-x-[-1]">
        <DropdownMenuItem onClick={() => setReasoningEffort("low")}>
          <Brain className="" /> Low
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setReasoningEffort("medium")}>
          <Brain className="" /> Medium
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setReasoningEffort("high")}>
          <Brain className="" /> High
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
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent sideOffset={5}>
          Add an attachment
          <br />
          <span className="text-xs text-muted-foreground">
            Accepts: Text, PNG, JPEG, GIF, WebP, PDF
          </span>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
