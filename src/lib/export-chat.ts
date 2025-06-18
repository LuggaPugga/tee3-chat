import { db } from "@/utils/instant"

async function exportChat(chatId: string) {
  const { data } = await db.queryOnce({
    chats: {
      $: {
        where: { id: chatId },
      },
      messages: {
        $: {
          where: { chat: chatId },
          order: {
            serverCreatedAt: "asc",
          },
        },
      },
    },
  })

  if (!data.chats || !data.chats[0]) {
    return
  }

  const title = `# ${data.chats[0].name || "Untitled Chat"}`
  const createdAt = `Created: ${new Date(data.chats[0].created_at).toLocaleString()}`
  const updatedAt = `Last Updated: ${new Date(data.chats[0].updated_at).toLocaleString()}`

  const messageParts = data.chats[0].messages.map((message) => {
    let header = ""
    if (message.role === "user") {
      header = "### User"
    } else if (message.role === "assistant") {
      header = `### Assistant`
      if (message.model) {
        header += ` (${message.model})`
      }
    }
    return `${header}\n\n${message.content || ""}\n\n---`
  })

  const exportContent = [title, createdAt, updatedAt, "---", ...messageParts].join("\n")

  return exportContent
}

export async function downloadChatExport(chatId: string, chatName: string) {
  const content = await exportChat(chatId)
  if (!content) return
  const blob = new Blob([content], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${chatName}.md`
  a.click()
  URL.revokeObjectURL(url)
}
