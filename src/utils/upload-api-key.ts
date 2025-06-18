import { createServerFn } from "@tanstack/react-start"
import { init, id } from "@instantdb/admin"
import authMiddleware from "@/lib/middleware"
import { hash } from "@/lib/hashing"
import schema from "instant.schema"

const db = init({
  appId: "d93ce927-79f1-4dd7-8618-df5668c4f0f7",
  adminToken: process.env.INSTANT_DB_ADMIN_TOKEN || "",
  schema: schema,
})

export const uploadApiKey = createServerFn({ method: "POST" })
  .validator((data: { key: string; provider: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { key, provider } = data

    const hashedKey = hash(key)
    const keyId = id()

    await db.transact(
      db.tx.apiKeys[keyId]
        .update({
          key: hashedKey,
          provider: provider,
        })
        .link({ user: context.user.id })
    )

    return true
  })
