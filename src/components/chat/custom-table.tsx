import { useState, useMemo, useCallback, ReactNode } from "react"
import { Copy, Check, Download, LucideCode, LucideAArrowDown, LucideMerge } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

const getCellText = (cell: any): string => {
  if (!cell.children) return ""
  return cell.children.reduce((text: string, content: any) => {
    if (content.type === "text") {
      return text + content.value
    }
    return text
  }, "")
}

const CustomTable = ({ node, children }: { node?: any; children?: ReactNode }) => {
  const [copied, setCopied] = useState(false)

  const tsvContent = useMemo(() => {
    if (!node || !node.children) return ""
    const tableRows = node.children.flatMap((child: any) =>
      child.tagName === "thead" || child.tagName === "tbody" ? child.children : []
    )

    return tableRows
      .map((row: any) => {
        if (row.tagName === "tr") {
          return row.children
            .filter((cell: any) => cell.tagName === "th" || cell.tagName === "td")
            .map((cell: any) => getCellText(cell))
            .join("\t")
        }
        return null
      })
      .filter(Boolean)
      .join("\n")
  }, [node])

  const csvContent = useMemo(() => {
    if (!node || !node.children) return ""
    const tableRows = node.children.flatMap((child: any) =>
      child.tagName === "thead" || child.tagName === "tbody" ? child.children : []
    )

    return tableRows
      .map((row: any) => {
        if (row.tagName === "tr") {
          return row.children
            .filter((cell: any) => cell.tagName === "th" || cell.tagName === "td")
            .map((cell: any) => {
              let cellText = getCellText(cell)
              if (cellText.includes(",") || cellText.includes(`"`) || cellText.includes("\n")) {
                cellText = `"${cellText.replace(/"/g, `""`)}"`
              }
              return cellText
            })
            .join(",")
        }
        return null
      })
      .filter(Boolean)
      .join("\n")
  }, [node])

  const markdownContent = useMemo(() => {
    if (!node || !node.children) return ""

    const head = node.children.find((child: any) => child.tagName === "thead")
    const body = node.children.find((child: any) => child.tagName === "tbody")

    const getRowContent = (row: any, cellType: "th" | "td") =>
      row.children
        .filter((cell: any) => cell.tagName === cellType)
        .map((cell: any) => getCellText(cell).replace(/\|/g, `\\|`))

    let headerContent = ""
    let separator = ""
    if (head) {
      const headerRow = head.children.find((row: any) => row.tagName === "tr")
      if (headerRow) {
        const headerCells = getRowContent(headerRow, "th")
        headerContent = `| ${headerCells.join(" | ")} |\n`
        separator = `| ${headerCells.map(() => "---").join(" | ")} |\n`
      }
    }

    const bodyContent =
      body?.children
        .filter((row: any) => row.tagName === "tr")
        .map((row: any) => `| ${getRowContent(row, "td").join(" | ")} |`)
        .join("\n") || ""

    return `${headerContent}${separator}${bodyContent}`
  }, [node])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [])

  const downloadTable = useCallback(
    (format: "csv" | "md") => {
      const text = format === "csv" ? csvContent : markdownContent
      const mimeType = format === "csv" ? "text/csv;charset=utf-8;" : "text/markdown;charset=utf-8;"
      const blob = new Blob([text], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `table.${format}`
      a.click()
      URL.revokeObjectURL(url)
    },
    [csvContent, markdownContent]
  )

  return (
    <div className="w-full max-w-none overflow-clip">
      <div className="relative my-2 w-full overflow-hidden rounded-lg border border-accent/80">
        <div className="relative z-[1] max-h-[60vh] overflow-auto pb-0 scrollbar-transparent">
          <table className="my-0 w-full caption-bottom text-sm">{children}</table>
        </div>
        <div
          role="caption"
          className="relative z-[5] mt-0 block w-full rounded-b-lg bg-secondary p-1 text-right text-sm text-muted-foreground"
        >
          <div className="relative inline-block">
            {typeof window !== "undefined" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => downloadTable("csv")}>
                    <LucideCode className="mr-2 h-4 w-4" />
                    <span>CSV</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadTable("md")}>
                    <LucideAArrowDown className="mr-2 h-4 w-4" />
                    <span>Markdown</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(tsvContent)}>
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
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => copyToClipboard(csvContent)}>
                <LucideCode className="mr-2 h-4 w-4" />
                <span>CSV</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => copyToClipboard(markdownContent)}>
                <LucideAArrowDown className="mr-2 h-4 w-4" />
                <span>Markdown</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => copyToClipboard(tsvContent)}>
                <LucideMerge className="mr-2 h-4 w-4" />
                <span>Plain</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    </div>
  )
}

export default CustomTable
