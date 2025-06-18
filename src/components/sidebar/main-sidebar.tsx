import { Link } from "@tanstack/react-router"
import { Button } from "../ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "../ui/sidebar"
import Search from "./search"
import { useState } from "react"
import ChatsList from "./chat-list"
import { db } from "@/utils/instant"
export default function MainSidebar() {
  const [search, setSearch] = useState("")
  const auth = db.useAuth()

  return (
    <Sidebar className="border-none p-2 flex flex-col h-full">
      <SidebarHeader className="flex flex-col">
        <div className="h-8" />
        <Button
          className="border-reflect button-reflect bg-[rgb(162,59,103)] font-semibold shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 relative rounded-lg p-2 text-pink-50"
          asChild
        >
          <Link to="/">New Chat</Link>
        </Button>
        <Search search={search} setSearch={setSearch} />
      </SidebarHeader>
      <SidebarContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden small-scrollbar scroll-shadow relative pb-2">
        <ChatsList />
      </SidebarContent>
      <SidebarFooter className="flex flex-col  justify-end mt-auto">
        {auth.user?.id && !auth.isLoading ? (
          <Link
            to="/settings"
            className="flex select-none flex-row items-center justify-between gap-3 rounded-lg px-3 py-3 hover:bg-sidebar-accent focus:bg-sidebar-accent focus:outline-2"
            aria-label="Go to settings"
          >
            <div className="flex w-full min-w-0 flex-row items-center gap-3">
              <div className="h-8 w-8 rounded-full ring-1 ring-muted-foreground/20 bg-muted" />
              <div className="flex min-w-0 flex-col text-foreground">
                <span className="truncate text-sm font-medium">User</span>
                <span className="text-xs">Pro</span>
              </div>
            </div>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex w-full select-none items-center gap-4 rounded-lg p-4 text-muted-foreground hover:bg-sidebar-accent"
          >
            Login
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
