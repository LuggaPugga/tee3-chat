"use client"

import { useRouterState } from "@tanstack/react-router"
import { useMemo } from "react"
import { db } from "@/utils/instant"
import { EnrichedChat } from "@/lib/chat/types"
import { categorizeChats } from "@/lib/chat/utils"
import { ChatGroupDisplay } from "./chat-group-display"

export default function ChatsList() {
  const { error, data } = db.useQuery({
    chats: {
      $: {
        order: {
          updated_at: "asc",
        },
      },
    },
  })
  const { location } = useRouterState()

  const chatNameMap = useMemo(
    () =>
      data?.chats.reduce((map, chat) => {
        map.set(chat.id, chat.name || "Untitled Chat")
        return map
      }, new Map<string, string>()),
    [data?.chats]
  )

  const transformedChats = useMemo<EnrichedChat[]>(
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

  const chatGroups = useMemo(() => {
    return categorizeChats(transformedChats)
  }, [transformedChats])

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        Error loading chats {JSON.stringify(error)}
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-[calc(100vh-14rem)] overflow-auto no-scrollbar">
      {chatGroups.map((group) => (
        <ChatGroupDisplay key={group.label} group={group} currentPath={location.pathname} />
      ))}
    </div>
  )
}
