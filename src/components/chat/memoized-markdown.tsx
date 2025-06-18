import { memo } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import CustomCodeBlock from "./custom-code-block"
import CustomTable from "./custom-table"

const components: Components = {
  code: ({ inline, className, children }: any) => {
    const match = /language-(\w+)/.exec(className || "")
    const language = match ? match[1] : ""
    const code = String(children).replace(/\n$/, "")

    if (!inline) {
      return <CustomCodeBlock language={language} code={code} />
    }

    return (
      <code
        className={`mx-0.5 overflow-auto rounded-md bg-secondary/50 px-[7px] py-1 group-[:is(pre)]:flex group-[:is(pre)]:w-full`}
      >
        {children}
      </code>
    )
  },
  table: (props) => <CustomTable {...props} />,
  thead: ({ ...props }) => <thead className="rounded-t-lg [&_tr]:border-b" {...props} />,
  tbody: ({ ...props }) => <tbody className="[&_tr:last-child]:border-0" {...props} />,
  tr: ({ ...props }) => (
    <tr
      className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
      {...props}
    />
  ),
  th: ({ ...props }) => (
    <th
      className="sticky top-0 z-[5] h-10 bg-chat-background px-2 py-2 text-left align-middle text-sm font-medium text-foreground first:pl-4"
      {...props}
    />
  ),
  td: ({ ...props }) => (
    <td
      className="max-w-[40ch] overflow-hidden text-ellipsis whitespace-nowrap p-2 align-top text-sm first:pl-4 last:max-w-[65ch]"
      {...props}
    />
  ),
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    const processedContent = content.replace(/\n(?!\n)/g, "  \n")

    return (
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {processedContent}
      </ReactMarkdown>
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false
    return true
  }
)

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock"

export const MemoizedMarkdown = memo(({ content, id }: { content: string; id: string }) => {
  const blocks = content.split(/(```[\s\S]*?```)/)

  return blocks.map((block, index) => (
    <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
  ))
})

MemoizedMarkdown.displayName = "MemoizedMarkdown"
