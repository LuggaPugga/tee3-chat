import { createServerFn } from "@tanstack/react-start"
import { id } from "@instantdb/admin"
import authMiddleware from "@/lib/middleware"
import { hash } from "@/lib/hashing"
import { db } from "@/utils/instant-admin"

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
