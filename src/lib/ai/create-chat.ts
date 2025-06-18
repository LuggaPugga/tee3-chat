import { createServerFn } from "@tanstack/react-start"
import { generateChatName } from "./generate-name"
import { id } from "@instantdb/admin"
import authMiddleware from "../middleware"
import { db } from "@/utils/instant-admin"

export const createChat = createServerFn({ method: "POST" })
  .validator((data: { model: string; messages: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { model, messages } = data
    const chatName = await generateChatName(messages)
    const chatId = id()
    await db.transact(
      db.tx.chats[chatId]
        .update({
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: chatName,
          model: model,
        })
        .link({ user: context.user.id })
    )

    return chatId
  })
