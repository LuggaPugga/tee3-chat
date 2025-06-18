import { createFileRoute } from "@tanstack/react-router"
import Contact from "@/components/settings/contact"

export const Route = createFileRoute("/settings/contact")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mt-2 space-y-8">
      <Contact />
    </div>
  )
}
