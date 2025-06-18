import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { PlusIcon, SearchIcon, Settings2, SunMoon } from "lucide-react"
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
    <div className="fixed left-2 z-50 flex flex-row gap-0.5 p-1 mt-2 open bg-transparent">
      {!open && (
        <div className=" absolute inset-0 right-auto -z-10 rounded-md backdrop-blur-sm transition-[background-color,width] delay-125 duration-125 w-[6.75rem] bg-sidebar/50 blur-fallback:bg-sidebar max-sm:delay-125 max-sm:duration-125 max-sm:w-[6.75rem] max-sm:bg-sidebar/50"></div>
      )}
      <SidebarTrigger className="z-10 h-8 w-8 text-muted-foreground" />
      {!open && (
        <>
          <Button variant="ghost" size="icon" className="z-10 h-8 w-8 text-muted-foreground">
            <SearchIcon className="size-4" />
          </Button>
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="z-10 h-8 w-8 text-muted-foreground"
              disabled={!isChat}
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
    <div className="fixed right-2 z-50 flex flex-row gap-0.5 p-1 mt-2">
      {!open && (
        <div className="absolute inset-0 right-auto -z-10 rounded-md backdrop-blur-sm transition-[background-color,width] delay-125 duration-125 w-[4.625rem] bg-sidebar/50 blur-fallback:bg-sidebar max-sm:delay-125 max-sm:duration-125 max-sm:w-[4.625rem] max-sm:bg-sidebar/50"></div>
      )}
      <Link to="/settings">
        <Button variant="ghost" size="icon" className="z-10 h-8 w-8 text-muted-foreground">
          <Settings2 />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="z-10 h-8 w-8 text-muted-foreground"
        onClick={() => {
          switch (theme) {
            case "system": {
              const isDark =
                window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
              setTheme(isDark ? "light" : "dark")
              break
            }
            case "dark":
              setTheme("light")
              break
            case "light":
              setTheme("dark")
              break
            case "boring-dark":
              setTheme("boring-light")
              break
            case "boring-light":
              setTheme("light")
              break
            default:
              break
          }
        }}
      >
        {theme === "system" ? (
          <SunMoon className="size-4" />
        ) : theme === "dark" || theme === "boring-dark" ? (
          <SunIcon className="size-4" />
        ) : (
          <MoonIcon className="size-4" />
        )}
      </Button>{" "}
    </div>
  )
}
