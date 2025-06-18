import { db } from "@/utils/instant"
import { db as adminDb } from "@/utils/instant-admin"
import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"

const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const auth = await db.getAuth()
    if (!auth?.id) {
      throw redirect({
        to: "/",
      })
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
    if (!context.user?.refresh_token) {
      throw redirect({
        to: "/",
      })
    }
    const auth = await adminDb.auth.verifyToken(context.user.refresh_token)
    if (!auth?.id) {
      throw redirect({
        to: "/",
      })
    }
    return next()
  })

export default authMiddleware
