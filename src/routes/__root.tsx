/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import appCss from "@/styles/app.css?url"
import boringCss from "@/styles/boring.css?url"
import { seo } from "@/utils/seo"
import { ThemeProvider } from "@/components/theme-provider"
import NotFound from "@/components/not-found"
import { SettingsProvider } from "@/components/settings-provider"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatStreamProvider } from "@/contexts/chat-stream-context"
import RouteProtect from "@/components/route-protect"
import SearchCommandMenu from "@/components/search-menu"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Tee3 Chat",
        description: `tee3.chat is a t3.chat clone.`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: boringCss },
      {
        rel: "icon",
        type: "image/ico",
        sizes: "16x16",
        href: "/favicon.ico",
      },
    ],
  }),
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={["boring-dark", "boring-light", "dark", "light"]}
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <RouteProtect />
          <SidebarProvider>
            <SettingsProvider>
              <ChatStreamProvider>
                <SearchCommandMenu />
                {children}
              </ChatStreamProvider>
            </SettingsProvider>
          </SidebarProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
