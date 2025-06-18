import { cn } from "@/lib/utils"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import MainSidebar from "@/components/sidebar/main-sidebar"
import CollapsedMenu, { CollapsedMenuRight } from "../sidebar/collapsed-menu"
import { Curve } from "../sidebar/curve"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar()

  return (
    <>
      <div className="inset-0 dark:bg-sidebar !fixed z-0 boring:hidden">
        <div
          className="absolute inset-0 opacity-40 light:hidden"
          style={{
            backgroundImage:
              "radial-gradient(closest-corner at 120px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))",
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-40 dark:hidden"
          style={{
            backgroundImage:
              "radial-gradient(closest-corner at 120px 36px, rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0)), linear-gradient(rgb(254, 247, 255) 15%, rgb(244, 214, 250))",
          }}
        ></div>
        <div className="absolute inset-0 bg-noise"></div>
        <div className="absolute inset-0 bg-black/40 light:hidden"></div>
      </div>

      <MainSidebar />

      <main className="min-h-pwa relative flex w-full flex-1 flex-col transition-[width,height] overflow-hidden">
        <SidebarInset className="flex-1 bg-transparent">
          <CollapsedMenu />
          <CollapsedMenuRight />
          <div
            className={cn(
              "absolute bottom-0 top-0 w-full overflow-hidden border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none",
              open && "border-l border-t sm:translate-y-3.5 sm:rounded-tl-xl"
            )}
          >
            <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]"></div>
          </div>

          {open}
          <div className="absolute bottom-0 top-0 w-full">
            {open && <Curve />}

            <div
              className={cn("absolute inset-0 overflow-y-scroll z-30", open && "sm:pt-3.5")}
              id="chat-scroll-area"
              style={{
                paddingBottom: "144px",
                scrollbarGutter: "stable both-edges",
              }}
            >
              {children}
            </div>
          </div>
        </SidebarInset>
      </main>
    </>
  )
}
