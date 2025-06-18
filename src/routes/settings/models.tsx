import { createFileRoute } from "@tanstack/react-router"
import Models from "@/components/settings/models"

export const Route = createFileRoute("/settings/models")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Models />
}
