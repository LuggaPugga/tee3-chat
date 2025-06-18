import { db } from "@/utils/instant"

import { useEffect } from "react"
import { useRouter } from "@tanstack/react-router"

export default function RouteProtect() {
  const { user, isLoading } = db.useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && router.history.location.pathname !== "/" && !isLoading) {
      router.navigate({ to: "/" })
    }
  }, [user, router.history.location.pathname, isLoading])

  return null
}
