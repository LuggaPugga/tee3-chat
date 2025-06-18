import { db } from "@/utils/instant"
import { db as adminDb } from "@/utils/instant-admin"

import { createMiddleware } from "@tanstack/react-start"

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
