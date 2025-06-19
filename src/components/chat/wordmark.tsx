import { LucideQuote } from "lucide-react"
import { Button } from "../ui/button"
import { useState, useEffect, useRef } from "react"

interface WordmarkProps {
  setInput: (input: string) => void
}

export default function Wordmark({ setInput }: WordmarkProps) {
  const [selectedText, setSelectedText] = useState("")
  const [wordmarkPosition, setWordmarkPosition] = useState({ x: 0, y: 0 })
  const [showWordmark, setShowWordmark] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const wordmarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (wordmarkRef.current?.contains(e.target as Node)) {
        return
      }
      setIsMouseDown(true)
      setShowWordmark(false)
    }

    const handleMouseUp = () => {
      setIsMouseDown(false)
      setTimeout(() => {
        const selection = window.getSelection()
        if (selection && selection.toString().trim()) {
          const range = selection.getRangeAt(0)
          const container = range.commonAncestorContainer
          const element =
            container.nodeType === Node.TEXT_NODE ? container.parentElement : (container as Element)

          if (element?.closest(".prose.prose-pink")) {
            const text = selection.toString().trim()
            setSelectedText(text)

            const rects = range.getClientRects()
            const lastRect = rects[rects.length - 1]
            setWordmarkPosition({
              x: lastRect.right,
              y: lastRect.bottom + 5,
            })
            setShowWordmark(true)
          }
        }
      }, 10)
    }

    const handleSelectionChange = () => {
      if (!isMouseDown) {
        const selection = window.getSelection()
        if (!selection || !selection.toString().trim()) {
          setShowWordmark(false)
          setSelectedText("")
        }
      }
    }

    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("selectionchange", handleSelectionChange)

    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [isMouseDown])

  const handleWordmarkClick = () => {
    if (selectedText) {
      const quoted = selectedText
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n")
      setInput(quoted)
      setShowWordmark(false)
      window.getSelection()?.removeAllRanges()
    }
  }

  if (!showWordmark) return null

  return (
    <div
      ref={wordmarkRef}
      className="absolute z-50"
      style={{
        left: wordmarkPosition.x - 280,
        top: wordmarkPosition.y + 5,
      }}
    >
      <Button
        variant="outline"
        size="sm"
        className="h-7 w-10 rounded-full border-chat-border shadow-md !bg-background hover:!bg-primary hover:!text-primary-foreground"
        onClick={handleWordmarkClick}
      >
        <LucideQuote className="!size-3.5 fill-current" />
      </Button>
    </div>
  )
}
