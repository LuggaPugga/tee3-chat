import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Curve } from "@/components/sidebar/curve"
import MainSidebar from "@/components/sidebar/main-sidebar"
import CollapsedMenu, { CollapsedMenuRight } from "../sidebar/collapsed-menu"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar()

  return (
    <>
      <div className="inset-0 dark:bg-sidebar !fixed z-0 boring:hidden">
        <div
          className="absolute inset-0 opacity-40 dark:block hidden"
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
        <div className="absolute inset-0 bg-black/40 dark:block hidden"></div>
      </div>

      <MainSidebar />

      <main className="min-h-pwa relative flex w-full flex-1 flex-col transition-[width,height]">
        <SidebarInset className="flex-1 bg-transparent">
          <CollapsedMenu />
          <CollapsedMenuRight />
          <div className="absolute bottom-0 top-0 w-full overflow-hidden border-l border-t border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none open:sm:translate-y-3.5 sm:rounded-tl-xl">
            <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]"></div>
          </div>

          {open && (
            <>
              <div className="sticky inset-x-3 top-0 z-10 box-content overflow-hidden border-b border-chat-border bg-gradient-noise-top/80 backdrop-blur-md transition-[transform,border] ease-snappy blur-fallback:bg-gradient-noise-top max-sm:hidden sm:h-3.5">
                <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
                <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden"></div>
              </div>

              <div className="absolute top-0 w-full">
                <Curve />
              </div>
            </>
          )}
          <div className="relative z-10">{children}</div>
        </SidebarInset>
      </main>
    </>
  )
}
