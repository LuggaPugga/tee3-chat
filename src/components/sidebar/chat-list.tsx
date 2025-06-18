"use client"

import { useRouterState } from "@tanstack/react-router"
import { useMemo } from "react"
import { db } from "@/utils/instant"
import { EnrichedChat } from "@/lib/chat/types"
import { categorizeChats } from "@/lib/chat/utils"
import { ChatGroupDisplay } from "./chat-group-display"

export default function ChatsList() {
  const { error, data } = db.useQuery({
    chats: {},
  })
  const { location } = useRouterState()

  const sortedChats = useMemo(() => {
    if (!data?.chats) return []

    return [...data.chats].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  }, [data?.chats])

  const chatNameMap = useMemo(
    () =>
      sortedChats.reduce((map, chat) => {
        map.set(chat.id, chat.name || "Untitled Chat")
        return map
      }, new Map<string, string>()),
    [sortedChats]
  )

  const transformedChats = useMemo<EnrichedChat[]>(
    () =>
      sortedChats.map((chat) => ({
        id: chat.id,
        name: chat.name || "Untitled Chat",
        updated_at: new Date(chat.updated_at),
        branch_from: chat.branch_from || null,
        branch_from_name: chat.branch_from ? chatNameMap.get(chat.branch_from) : undefined,
        pinned: !!chat.pinned,
      })),
    [sortedChats, chatNameMap]
  )

  const chatGroups = useMemo(() => {
    return categorizeChats(transformedChats)
  }, [transformedChats])

  if (error) {
    return <div className="p-4 text-center text-destructive">Error loading chats</div>
  }

  if (!data?.chats || data.chats.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No chats found</div>
  }

  return (
    <div className="space-y-2 max-h-[calc(100vh-14rem)] overflow-auto no-scrollbar">
      {chatGroups.map((group) => (
        <ChatGroupDisplay key={group.label} group={group} currentPath={location.pathname} />
      ))}
    </div>
  )
}
