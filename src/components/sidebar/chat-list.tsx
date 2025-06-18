"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar"
import { Link, useRouterState } from "@tanstack/react-router"
import { GitBranchIcon, PinIcon, PinOffIcon, XIcon } from "lucide-react"
import { useMemo, memo, useState, useRef, useEffect } from "react"
import { db } from "@/utils/instant"
import DeleteChat from "../delete-chat"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { cn } from "@/lib/utils"

type EnrichedChat = {
  id: string
  name: string
  updated_at: Date
  branch_from: string | null
  pinned?: boolean
  branch_from_name?: string
}

interface ChatGroup {
  label: string
  chats: EnrichedChat[]
}

const DAY_IN_MS = 86400000

function categorizeChats(chats: EnrichedChat[]): ChatGroup[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - DAY_IN_MS)
  const last7Days = new Date(today.getTime() - 7 * DAY_IN_MS)
  const last30Days = new Date(today.getTime() - 30 * DAY_IN_MS)

  const groups: Record<string, EnrichedChat[]> = {
    Pinned: [],
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    "Last 30 Days": [],
    Older: [],
  }

  for (const chat of chats) {
    if (chat.pinned) {
      groups.Pinned.push(chat)
      continue
    }

    const chatDate = chat.updated_at
    const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())

    if (chatDay.getTime() === today.getTime()) {
      groups.Today.push(chat)
    } else if (chatDay.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(chat)
    } else if (chatDate >= last7Days) {
      groups["Last 7 Days"].push(chat)
    } else if (chatDate >= last30Days) {
      groups["Last 30 Days"].push(chat)
    } else {
      groups.Older.push(chat)
    }
  }

  const orderedLabels = ["Pinned", "Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Older"]

  return orderedLabels
    .map((label) => {
      const sortedChats = groups[label].sort(
        (a, b) => b.updated_at.getTime() - a.updated_at.getTime()
      )
      return { label, chats: sortedChats }
    })
    .filter((group) => group.chats.length > 0)
}

const ChatItem = memo(({ chat, isActive }: { chat: EnrichedChat; isActive: boolean }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(chat.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const togglePin = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    await db.transact([
      db.tx.chats[chat.id].update({
        pinned: !chat.pinned,
      }),
    ])
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
    setEditValue(chat.name)
  }

  const handleSave = async () => {
    if (editValue.trim() && editValue.trim() !== chat.name) {
      await db.transact([
        db.tx.chats[chat.id].update({
          name: editValue.trim(),
        }),
      ])
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(chat.name)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancel()
    }
  }

  const handleBlur = () => {
    handleSave()
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="group/link relative flex h-9 w-full items-center overflow-hidden rounded-lg px-2 py-1"
      >
        <Link
          to={`/chat/$chatId`}
          params={{ chatId: chat.id }}
          className="flex w-full items-center justify-between"
        >
          <div className="relative flex w-full items-center">
            {chat.branch_from && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="mr-1 h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground flex items-center justify-center"
                    tabIndex={-1}
                  >
                    <GitBranchIcon className="size-4" />
                  </span>
                </TooltipTrigger>
                <TooltipContent sideOffset={5} side="top">
                  Branched from {chat.branch_from_name}
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <div className="w-full truncate" onDoubleClick={handleDoubleClick}>
                  <div className="relative w-full">
                    <input
                      ref={inputRef}
                      aria-label="Thread title"
                      aria-describedby="thread-title-hint"
                      aria-readonly={!isEditing}
                      readOnly={!isEditing}
                      tabIndex={isEditing ? 0 : -1}
                      className={cn(
                        "hover:truncate-none h-full w-full rounded bg-transparent px-1 py-1 text-sm outline-none overflow-hidden truncate",
                        isEditing
                          ? "text-foreground bg-background cursor-text pointer-events-auto"
                          : "text-muted-foreground pointer-events-none"
                      )}
                      type="text"
                      value={isEditing ? editValue : chat.name}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleBlur}
                      onClick={(e) => {
                        if (isEditing) {
                          e.preventDefault()
                          e.stopPropagation()
                        }
                      }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={5} side="bottom">
                {chat.name}
              </TooltipContent>
            </Tooltip>

            {!isEditing && (
              <div className="pointer-events-auto absolute -right-1 bottom-0 top-0 z-50 flex translate-x-full items-center justify-end text-muted-foreground transition-transform group-hover/link:translate-x-0 group-hover/link:bg-sidebar-accent">
                <div className="pointer-events-none absolute bottom-0 right-[100%] top-0 h-12 w-8 bg-gradient-to-l from-sidebar-accent to-transparent opacity-0 group-hover/link:opacity-100"></div>
                <button
                  className="rounded-md p-1.5 hover:bg-muted/40"
                  tabIndex={-1}
                  onClick={togglePin}
                  aria-label={chat.pinned ? "Unpin thread" : "Pin thread"}
                >
                  {chat.pinned ? <PinOffIcon className="size-4" /> : <PinIcon className="size-4" />}
                </button>
                <DeleteChat threadName={chat.name} threadId={chat.id}>
                  <div>
                    <button
                      className="rounded-md p-1.5 hover:bg-destructive/50 hover:text-destructive-foreground pointer-events-auto"
                      tabIndex={-1}
                      data-action="thread-delete"
                      aria-label="Delete thread"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                </DeleteChat>
              </div>
            )}
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})

ChatItem.displayName = "ChatItem"

const ChatGroupDisplay = memo(
  ({ group, currentPath }: { group: ChatGroup; currentPath: string }) => {
    return (
      <SidebarGroup className="relative flex w-full min-w-0 flex-col p-2">
        <SidebarGroupLabel className="px-1.5 text-heading">
          {group.label === "Pinned" ? (
            <span className="flex items-center">
              <PinIcon className="-ml-0.5 mr-1 mt-px !size-3" />
              {group.label}
            </span>
          ) : (
            <span>{group.label}</span>
          )}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {group.chats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} isActive={currentPath.includes(chat.id)} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }
)

ChatGroupDisplay.displayName = "ChatGroupDisplay"

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
