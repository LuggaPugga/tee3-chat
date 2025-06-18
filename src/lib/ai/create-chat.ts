import { createServerFn } from "@tanstack/react-start"
import { generateChatName } from "./generate-name"
import { init, id } from "@instantdb/admin"
import authMiddleware from "../middleware"

const db = init({
  appId: "d93ce927-79f1-4dd7-8618-df5668c4f0f7",
  adminToken: process.env.INSTANT_DB_ADMIN_TOKEN || "",
})

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
