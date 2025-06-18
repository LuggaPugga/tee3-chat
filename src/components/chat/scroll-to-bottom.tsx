import { ChevronDown } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

interface ScrollToBottomProps {
  isVisible: boolean
  onClick: () => void
}

export default function ScrollToBottom({ isVisible, onClick }: ScrollToBottomProps) {
  const { open } = useSidebar()

  return (
    <div
      className={`fixed bottom-[140px] z-10 transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      } ${open ? "left-[calc(50%+8rem)]" : "left-[calc(50%+1.5rem)]"}`}
      style={{
        transform: "translateX(-50%)",
      }}
    >
      <button
        onClick={onClick}
        className="justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:hover:bg-secondary/50 h-8 px-3 text-xs flex items-center gap-2 rounded-full border border-secondary/40 bg-[var(--chat-overlay)] text-secondary-foreground/70 backdrop-blur-xl hover:bg-secondary transition-all duration-200 ease-in-out"
      >
        <ChevronDown className="h-4 w-4" />
        <span>Scroll to bottom</span>
      </button>
    </div>
  )
}
