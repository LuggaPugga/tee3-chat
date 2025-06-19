import React from "react"
import { useRouterState } from "@tanstack/react-router"
import { db } from "@/utils/instant"
import { EnrichedChat } from "@/lib/chat/types"
import { categorizeChats } from "@/lib/chat/utils"
import { SidebarGroup, SidebarGroupLabel } from "../ui/sidebar"
import { PinIcon } from "lucide-react"
import { ChatItem } from "./chat-item"
import { useVirtualizer } from "@tanstack/react-virtual"

export default function ChatsList({ search }: { search: string }) {
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)
  const debounceTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (!search) {
      setDebouncedSearch("")
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
      return
    }
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search)
    }, 100)
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    }
  }, [search])

  const { error, data } = db.useQuery({
    chats: {
      $: {
        order: {
          updated_at: "asc",
        },
        ...(debouncedSearch
          ? {
              where: {
                name: {
                  $ilike: `%${debouncedSearch}%`,
                },
              },
            }
          : {}),
      },
    },
  })
  const { location } = useRouterState()

  const chatNameMap = React.useMemo(
    () =>
      data?.chats.reduce((map, chat) => {
        map.set(chat.id, chat.name || "Untitled Chat")
        return map
      }, new Map<string, string>()),
    [data?.chats]
  )

  const transformedChats = React.useMemo<EnrichedChat[]>(
    () =>
      data?.chats
        ? data.chats.map((chat) => ({
            id: chat.id,
            name: chat.name || "Untitled Chat",
            updated_at: new Date(chat.updated_at),
            branch_from: chat.branch_from || null,
            branch_from_name: chat.branch_from ? chatNameMap?.get(chat.branch_from) : undefined,
            pinned: !!chat.pinned,
          }))
        : [],
    [data?.chats, chatNameMap]
  )

  const chatGroups = React.useMemo(() => {
    return categorizeChats(transformedChats)
  }, [transformedChats])

  const flattenedItems = React.useMemo(() => {
    const items: Array<{
      type: "header" | "chat"
      group?: string
      chat?: EnrichedChat
      index: number
    }> = []
    let index = 0

    chatGroups.forEach((group) => {
      items.push({ type: "header", group: group.label, index: index++ })
      group.chats.forEach((chat) => {
        items.push({ type: "chat", chat, index: index++ })
      })
    })

    return items
  }, [chatGroups])

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        Error loading chats {JSON.stringify(error)}
      </div>
    )
  }

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: flattenedItems.length,
    estimateSize: (index) => {
      return flattenedItems[index]?.type === "header" ? 40 : 36
    },
    getScrollElement: () => scrollContainerRef.current,
    overscan: 10,
  })

  return (
    <div ref={scrollContainerRef} className="max-h-[calc(100vh-14rem)] overflow-auto no-scrollbar">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = flattenedItems[virtualItem.index]

          if (item?.type === "header") {
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <SidebarGroup className="relative flex w-full min-w-0 flex-col p-2">
                  <SidebarGroupLabel className="px-1.5 text-heading">
                    {item.group === "Pinned" ? (
                      <span className="flex items-center">
                        <PinIcon className="-ml-0.5 mr-1 mt-px !size-3" />
                        {item.group}
                      </span>
                    ) : (
                      <span>{item.group}</span>
                    )}
                  </SidebarGroupLabel>
                </SidebarGroup>
              </div>
            )
          }

          if (item?.type === "chat" && item.chat) {
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="px-2"
              >
                <ChatItem chat={item.chat} isActive={location.pathname.includes(item.chat.id)} />
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
