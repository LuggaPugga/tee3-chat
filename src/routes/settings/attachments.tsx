import { createFileRoute } from "@tanstack/react-router"
import Attachments from "@/components/settings/attachments"

export const Route = createFileRoute("/settings/attachments")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mt-2 space-y-8">
      <Attachments />
    </div>
  )
}
