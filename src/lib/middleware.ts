import { db } from "@/utils/instant"
import { init } from "@instantdb/admin"
import { createMiddleware } from "@tanstack/react-start"
import schema from "instant.schema"

const adminDb = init({
  appId: "d93ce927-79f1-4dd7-8618-df5668c4f0f7",
  adminToken: process.env.INSTANT_DB_ADMIN_TOKEN || "",
  schema: schema,
})

const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const auth = await db.getAuth()
    if (!auth?.id) {
      throw new Error("User not authenticated")
    }
    return next({
      sendContext: {
        user: {
          id: auth.id,
          email: auth.email,
          refresh_token: auth.refresh_token,
        },
      },
    })
  })
  .server(async ({ next, context }) => {
    const auth = await adminDb.auth.verifyToken(context.user.refresh_token)
    if (!auth?.id) {
      throw new Error("User not authenticated")
    }
    return next()
  })

export default authMiddleware
