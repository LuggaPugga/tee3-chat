import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { PlusIcon, SearchIcon, Settings2 } from "lucide-react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useRouter } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { useTheme } from "@/components/theme-provider"

export default function CollapsedMenu() {
  const { open } = useSidebar()

  const router = useRouter()
  const pathname = router.state.location.pathname
  const isChat = pathname.startsWith("/chat")
  console.log(pathname)
  return (
    <div className="pointer-events-auto fixed left-2 z-50 flex flex-row gap-0.5 p-1 mt-2 open bg-transparent">
      {!open && (
        <div className="pointer-events-none absolute inset-0 right-auto -z-10 rounded-md backdrop-blur-sm transition-[background-color,width] delay-125 duration-125 w-[6.75rem] bg-sidebar/50 blur-fallback:bg-sidebar max-sm:delay-125 max-sm:duration-125 max-sm:w-[6.75rem] max-sm:bg-sidebar/50"></div>
      )}
      <SidebarTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 z-10 h-8 w-8 text-muted-foreground" />
      {!open && (
        <>
          <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            size="icon"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 z-10 h-8 w-8 text-muted-foreground"
          >
            <SearchIcon className="size-4" />
            <span className="sr-only">Search</span>
          </Button>
          <Link to="/">
            <Button
              data-sidebar="trigger"
              data-slot="sidebar-trigger"
              variant="ghost"
              size="icon"
              disabled={!isChat}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 z-10 h-8 w-8 text-muted-foreground"
            >
              <PlusIcon className="size-4" />
              <span className="sr-only">New Thread</span>
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}

export function CollapsedMenuRight() {
  const { theme, setTheme } = useTheme()
  const { open } = useSidebar()
  return (
    <div className="pointer-events-auto fixed right-2 z-50 flex flex-row gap-0.5 p-1 mt-2">
      {!open && (
        <div className="pointer-events-none absolute inset-0 right-auto -z-10 rounded-md backdrop-blur-sm transition-[background-color,width] delay-125 duration-125 w-[6.75rem] bg-sidebar/50 blur-fallback:bg-sidebar max-sm:delay-125 max-sm:duration-125 max-sm:w-[6.75rem] max-sm:bg-sidebar/50"></div>
      )}
      <Link to="/settings">
        <Button
          variant="ghost"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 z-10 h-8 w-8 text-muted-foreground"
        >
          <Settings2 />
        </Button>
      </Link>
      <Button
        variant="ghost"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 z-10 h-8 w-8 text-muted-foreground"
        onClick={() =>
          setTheme(
            theme === "dark"
              ? "light"
              : theme === "light"
                ? "dark"
                : theme === "boring-light"
                  ? "boring-dark"
                  : "boring-light"
          )
        }
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  )
}
