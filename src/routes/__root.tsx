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
        title: "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: boringCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
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
          <SidebarProvider>
            <SettingsProvider>
              <ChatStreamProvider>{children}</ChatStreamProvider>
            </SettingsProvider>
          </SidebarProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
