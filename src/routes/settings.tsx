import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router"
import { ArrowLeft, Moon, Sun } from "lucide-react"
import Profile from "@/components/settings/profile"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/settings")({
  component: LayoutComponent,
})

function LayoutComponent() {
  const location = useLocation()

  const navigationItems = [
    { value: "account", label: "Account", href: "/settings/account" },
    { value: "customization", label: "Customization", href: "/settings/customization" },
    { value: "history", label: "History & Sync", href: "/settings/history" },
    { value: "models", label: "Models", href: "/settings/models" },
    { value: "api-keys", label: "API Keys", href: "/settings/api-keys" },
    { value: "attachments", label: "Attachments", href: "/settings/attachments" },
    { value: "contact", label: "Contact Us", href: "/settings/contact" },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="max-h-screen w-full overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
      <div className="inset-0 -z-50 dark:bg-sidebar fixed boring:hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(closest-corner at 180px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))",
          }}
        ></div>
        <div className="absolute inset-0 bg-noise"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col overflow-y-auto px-4 pb-24 pt-6 md:px-6 lg:px-8">
        <header className="flex items-center justify-between pb-8">
          <Link to="/">
            <Button variant="ghost" className="hover:bg-muted/40">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chat
            </Button>
          </Link>
          <div className="flex flex-row items-center gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 group relative size-8"
              tabIndex={-1}
              data-state="closed"
            >
              <Moon className="absolute size-4 transition-all duration-200 -rotate-90 scale-0" />
              <Sun className="absolute size-4 transition-all duration-200 rotate-0 scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-9 px-4 py-2 hover:bg-muted/40">
              Sign out
            </button>
          </div>
        </header>

        <div className="flex flex-grow flex-col gap-4 md:flex-row">
          <div className="hidden space-y-8 md:block md:w-1/4">
            <Profile />
          </div>

          <div className="md:w-3/4 md:pl-12">
            <div className="space-y-6">
              <nav className="inline-flex h-9 items-center gap-1 rounded-lg bg-secondary/80 p-1 text-secondary-foreground no-scrollbar -mx-0.5 w-full justify-start overflow-auto md:w-fit">
                {navigationItems.map((item) => (
                  <Link
                    key={item.value}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                      isActive(item.href)
                        ? "bg-background text-foreground shadow"
                        : "hover:bg-muted/60"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-2">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
