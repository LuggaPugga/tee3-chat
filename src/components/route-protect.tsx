import { db } from "@/utils/instant"

import { useEffect } from "react"
import { useRouter } from "@tanstack/react-router"

export default function RouteProtect() {
  const { user } = db.useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && router.history.location.pathname !== "/") {
      router.navigate({ to: "/" })
    }
  }, [user, router.history.location.pathname])

  return null
}
