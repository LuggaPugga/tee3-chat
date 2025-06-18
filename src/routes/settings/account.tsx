import { createFileRoute } from "@tanstack/react-router"
import Account from "@/components/settings/account"

export const Route = createFileRoute("/settings/account")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-8">
      <Account />
      <div className="space-y-6 rounded-lg bg-card p-4 md:hidden">
        <div className="flex flex-row justify-between sm:flex-col sm:justify-between lg:flex-row lg:items-center">
          <span className="text-sm font-semibold">Message Usage</span>
          <div className="text-xs text-muted-foreground">
            <p data-state="closed">Resets Friday at 8:23 PM</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Standard</h3>
              <span className="text-sm text-muted-foreground">264/1500</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: "17.6%" }}></div>
            </div>
            <p className="text-sm text-muted-foreground">1236 messages remaining</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <h3 className="text-sm font-medium">Premium</h3>
                <button
                  type="button"
                  className="flex items-center focus:outline-none"
                  aria-label="Premium credits info"
                  data-state="closed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-info h-4 w-4 text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </button>
              </div>
              <span className="text-sm text-muted-foreground">7/100</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: "7%" }}></div>
            </div>
            <p className="text-sm text-muted-foreground">93 messages remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}
