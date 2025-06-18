import { createFileRoute } from "@tanstack/react-router"
import Customization from "@/components/settings/customization"

export const Route = createFileRoute("/settings/customization")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Customization />
}
