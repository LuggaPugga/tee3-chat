import { db } from "@/utils/instant"
import { Copy, Info, ArrowRight } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useSettings } from "../settings-provider"
import { Button } from "../ui/button"

export default function Profile() {
  const { hidePersonalInfo } = useSettings()
  const auth = db.useAuth()
  const { data } = db.useQuery({
    usage: {
      $: {
        limit: 1,
        where: auth.user?.id ? { user: auth.user.id } : undefined,
      },
    },
    preferences: {
      $: {
        limit: 1,
        where: auth.user?.id ? { user: auth.user.id } : undefined,
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className={`relative text-center ${hidePersonalInfo ? "group" : ""}`}>
        <div
          className={`mx-auto rounded-full transition-opacity duration-200 h-[160px] w-[160px] bg-accent ${hidePersonalInfo ? "blur-lg group-hover:opacity-50" : ""}`}
        />
        <h1
          className={`mt-4 text-2xl font-bold transition-opacity duration-200 ${hidePersonalInfo ? "blur-[6px] group-hover:opacity-50" : ""}`}
        >
          {data?.preferences?.[0]?.name}
        </h1>
        <div className="relative flex items-center justify-center">
          <p className="break-all text-muted-foreground transition-opacity duration-200"></p>
        </div>
        <p
          className={`${hidePersonalInfo ? "" : "perspective-1000 group"} relative h-6 ${hidePersonalInfo ? "" : "cursor-pointer"} break-all text-muted-foreground ${hidePersonalInfo ? "blur-[6px] group-hover:opacity-50" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Copy user ID to clipboard"
        >
          <span
            className={`absolute inset-0 ${hidePersonalInfo ? "" : "transition-transform duration-300 [backface-visibility:hidden] [transform-style:preserve-3d] truncate group-hover:[transform:rotateX(180deg)]"}`}
          >
            {hidePersonalInfo ? "Hidden" : auth.user?.email}
          </span>
          {!hidePersonalInfo && (
            <span className="absolute inset-0 transition-transform duration-300 [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotateX(180deg)] group-hover:[transform:rotateX(0deg)]">
              <span className="flex h-6 items-center justify-center gap-2 text-sm">
                <span
                  className="flex items-center gap-2"
                  onClick={() => navigator.clipboard.writeText(auth.user?.id || "")}
                >
                  Copy User ID
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </span>
                </span>
              </span>
            </span>
          )}
        </p>

        {hidePersonalInfo && (
          <button
            className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground opacity-0 transition-opacity duration-200 hover:text-foreground group-hover:opacity-100"
            tabIndex={0}
            aria-label="Copy user ID to clipboard"
            onClick={() => navigator.clipboard.writeText(auth.user?.id || "")}
          >
            Copy ID
          </button>
        )}

        <span className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary text-primary-foreground">
          Pro Plan
        </span>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-4">
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
              <span className="text-sm text-muted-foreground">
                {data?.usage?.[0]?.standard || 0}/1500
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${((data?.usage?.[0]?.standard || 0) / 1500) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {1500 - (data?.usage?.[0]?.standard || 0)} messages remaining
            </p>
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
                  <Info className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {data?.usage?.[0]?.premium || 0}/100
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${((data?.usage?.[0]?.premium || 0) / 100) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {100 - (data?.usage?.[0]?.premium || 0)} messages remaining
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Button
            className="border-reflect button-reflect bg-[rgb(162,59,103)] font-semibold shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 relative rounded-lg p-2 text-pink-50"
            asChild
          >
            <Link to="/settings">
              Buy more premium credits
              <ArrowRight className="-mr-1 !size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-4">
        <span className="text-sm font-semibold">Keyboard Shortcuts</span>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Search</span>
            <div className="flex gap-1">
              <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">Ctrl</kbd>
              <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">K</kbd>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">New Chat</span>
            <div className="flex gap-1">
              <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">Ctrl</kbd>
              <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">Shift</kbd>
              <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">O</kbd>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Toggle Sidebar</span>
            <div className="flex gap-1">
              <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">Ctrl</kbd>
              <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">B</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
