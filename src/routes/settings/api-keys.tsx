import { createFileRoute } from "@tanstack/react-router"
import ApiKeys from "@/components/settings/api-keys"

export const Route = createFileRoute("/settings/api-keys")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mt-2 space-y-8">
      <ApiKeys />
    </div>
  )
}
