import { memo, useState, useEffect } from "react"
import { codeToHtml } from "shiki"
import { Copy, Check, Download, Text, WrapText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { t3DarkTheme, t3LightTheme } from "@/lib/shiki-theme"

interface CustomCodeBlockProps {
  language: string
  code: string
}

const CustomCodeBlock = memo(({ language, code }: CustomCodeBlockProps) => {
  const [highlightedCode, setHighlightedCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [textWrap, setTextWrap] = useState(false)

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const html = await codeToHtml(code, {
          lang: language || "text",
          themes: {
            light: t3LightTheme,
            dark: t3DarkTheme,
          },
        })
        setHighlightedCode(html)
      } catch {
        const html = await codeToHtml(code, {
          lang: "text",
          themes: {
            light: t3LightTheme,
            dark: t3DarkTheme,
          },
        })
        setHighlightedCode(html)
      }
    }

    highlightCode()
  }, [code, language])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `file.${language}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleTextWrap = () => {
    setTextWrap(!textWrap)
  }

  return (
    <div className="relative mt-2 flex w-full max-w-none flex-col pt-9">
      <div className="absolute inset-x-0 top-0 flex h-9 items-center justify-between rounded-t bg-secondary px-4 py-2 text-sm text-secondary-foreground">
        <span className="text-sm text-secondary-foreground font-mono">{language || "text"}</span>
        <div>
          <Button variant="ghost" size="icon" onClick={downloadCode}>
            <Download />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTextWrap}>
            {textWrap ? (
              <WrapText className="transition-all duration-200 ease-in-out" />
            ) : (
              <Text className="transition-all duration-200 ease-in-out" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              copyToClipboard()
            }}
            aria-label="Copy code"
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
      </div>
      <div
        className={`overflow-x-auto [&>pre]:!bg-chat-accent  [&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:!p-4 [&>pre]:text-sm not-prose ${
          textWrap ? "[&>pre]:whitespace-pre-wrap" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  )
})

CustomCodeBlock.displayName = "CustomCodeBlock"

export default CustomCodeBlock
