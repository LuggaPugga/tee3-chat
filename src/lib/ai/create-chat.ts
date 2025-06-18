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
    const chatId = id()
    const { user } = context

    const temporaryName = "New Chat"
    await db.transact(
      db.tx.chats[chatId]
        .update({
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: temporaryName,
          model: model,
        })
        .link({ user: user.id })
    )

    generateChatName(messages, user.id).then((chatName) => {
      return db.transact(
        db.tx.chats[chatId].update({
          name: chatName,
          updated_at: new Date().toISOString(),
        })
      )
    })

    return chatId
  })
