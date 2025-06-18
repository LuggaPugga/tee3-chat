import { createFileRoute } from "@tanstack/react-router"
import History from "@/components/settings/history"

export const Route = createFileRoute("/settings/history")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mt-2 space-y-12">
      <History />
    </div>
  )
}
