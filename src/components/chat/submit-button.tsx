import { Button } from "../ui/button"
import { ArrowUp, Square } from "lucide-react"

export default function SubmitButton({
  onClick,
  disabled,
  streaming,
}: {
  onClick: (e: React.FormEvent) => void
  disabled: boolean
  streaming: boolean
}) {
  return (
    <Button
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect bg-[rgb(162,59,103)] font-semibold shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 w-9 relative rounded-lg p-2 text-pink-50"
    >
      {streaming ? <Square className="!size-5" /> : <ArrowUp className="!size-5" />}
    </Button>
  )
}
