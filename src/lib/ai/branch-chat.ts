import { createServerFn } from "@tanstack/react-start"
import { init, id } from "@instantdb/admin"
import authMiddleware from "../middleware"

const db = init({
  appId: "d93ce927-79f1-4dd7-8618-df5668c4f0f7",
  adminToken: process.env.INSTANT_DB_ADMIN_TOKEN || "",
})

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
      throw new Error("Chat not found")
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
          user_name: message.user_name,
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
