import { createServerFn } from "@tanstack/react-start"
import { db } from "@/utils/instant-admin"
import authMiddleware from "@/lib/middleware"

export const deleteAccount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const deletedUser = await db.auth.deleteUser({ id: context.user.id })
    if (!deletedUser) {
      return false
    }
    return true
  })
