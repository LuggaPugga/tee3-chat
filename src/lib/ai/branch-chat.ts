import { createServerFn } from "@tanstack/react-start"
import { id } from "@instantdb/admin"
import authMiddleware from "../middleware"
import { db } from "@/utils/instant-admin"

export const branchChat = createServerFn({ method: "POST" })
  .validator((data: { id: string; messageId: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { id: originalChatId, messageId } = data

    const originalChat = await db.query({
      chats: { $: { where: { id: originalChatId } } },
      messages: { $: { where: { chat: originalChatId } } },
    })
    if (!originalChat || !originalChat.chats || originalChat.chats.length === 0) {
      return null
    }
    const chatName = originalChat.chats[0].name

    const chatId = id()
    await db.transact(
      db.tx.chats[chatId]
        .update({
          name: chatName,
          branch_from: originalChat.chats[0].id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .link({ user: context.user.id })
    )

    const copiedMessages = []

    for (const message of originalChat.messages) {
      const newMessageId = id()
      await db.transact([
        db.tx.messages[newMessageId].update({
          content: message.content,
          role: message.role,
          status: message.status,
          thinking_text: message.thinking_text,
          model: message.model,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
        db.tx.messages[newMessageId].link({ chat: chatId }),
      ])
      copiedMessages.push(newMessageId)

      if (message.id === messageId) {
        break
      }
    }

    return chatId
  })
