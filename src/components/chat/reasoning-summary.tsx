import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown } from "lucide-react"
import { MemoizedMarkdown } from "@/components/chat/memoized-markdown"

interface ReasoningSummaryProps {
  content: string
  defaultOpen?: boolean
  className?: string
}

export function ReasoningSummary({
  content,
  defaultOpen = false,
  className = "",
}: ReasoningSummaryProps) {
  return (
    <div className={`max-w-full mb-4 ${className}`}>
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? "reasoning" : undefined}
        className="w-full"
      >
        <AccordionItem value="reasoning" className="border-none">
          <AccordionTrigger className="mb-2 items-center gap-2 text-sm text-secondary-foreground flex-row justify-start">
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            Reasoning
          </AccordionTrigger>
          <AccordionContent className="pb-0 bg-chat-accent rounded-lg">
            <div className="w-full rounded-lg p-4 opacity-90 space-y-4 break-words">
              <MemoizedMarkdown content={content} id={"reasoning-summary" + content.slice(0, 5)} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
