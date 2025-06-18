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

interface ChatGroup {
  label: string
  chats: Array<{
    id: string
    name: string
    updated_at: Date
    branch_from: string
    pinned?: boolean
  }>
}

function categorizeChats(
  chats: Array<{
    id: string
    name: string
    updated_at: Date
    branch_from: string
    pinned?: boolean
  }>
) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const groups: ChatGroup[] = [
    { label: "Pinned", chats: [] },
    { label: "Today", chats: [] },
    { label: "Yesterday", chats: [] },
    { label: "Last 7 Days", chats: [] },
    { label: "Last 30 Days", chats: [] },
    { label: "Older", chats: [] },
  ]

  chats.forEach((chat) => {
    // If pinned, add to pinned group
    if (chat.pinned) {
      groups[0].chats.push(chat)
      return
    }

    const chatDate = new Date(chat.updated_at)
    const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())

    if (chatDay.getTime() === today.getTime()) {
      groups[1].chats.push(chat)
    } else if (chatDay.getTime() === yesterday.getTime()) {
      groups[2].chats.push(chat)
    } else if (chatDate >= last7Days) {
      groups[3].chats.push(chat)
    } else if (chatDate >= last30Days) {
      groups[4].chats.push(chat)
    } else {
      groups[5].chats.push(chat)
    }
  })

  groups.forEach((group) => {
    group.chats.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  })

  return groups.filter((group) => group.chats.length > 0)
}

// Memoized chat item component to prevent unnecessary re-renders
const ChatItem = memo(
  ({
    chat,
    isActive,
  }: {
    chat: { id: string; name: string; updated_at: Date; branch_from: string; pinned?: boolean }
    isActive: boolean
  }) => {
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
                <span
                  className="mr-1 h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground flex items-center justify-center"
                  title="Branched chat"
                  aria-label="Branched chat"
                  tabIndex={-1}
                >
                  <GitBranchIcon className="size-4" />
                </span>
              )}

              <button className="w-full" onDoubleClick={handleDoubleClick}>
                <div className="relative w-full">
                  <input
                    ref={inputRef}
                    aria-label="Thread title"
                    aria-describedby="thread-title-hint"
                    aria-readonly={!isEditing}
                    readOnly={!isEditing}
                    tabIndex={isEditing ? 0 : -1}
                    className={`hover:truncate-none h-full w-full rounded bg-transparent px-1 py-1 text-sm outline-none overflow-hidden truncate ${
                      isEditing
                        ? "text-foreground bg-background cursor-text pointer-events-auto"
                        : "text-muted-foreground pointer-events-none cursor-pointer"
                    }`}
                    title={chat.name}
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
              </button>

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
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }
)

ChatItem.displayName = "ChatItem"

const ChatGroup = memo(({ group, currentPath }: { group: ChatGroup; currentPath: string }) => {
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
})

ChatGroup.displayName = "ChatGroup"

export default function ChatsList({
  search,
  setSearch,
}: {
  search?: string
  setSearch?: (search: string) => void
}) {
  const auth = db.useAuth()
  const query = search
    ? { chats: { $: { where: { name: { $like: `%${search}%` } } } } }
    : { chats: {} }
  const { isLoading, error, data } = db.useQuery(query)
  const { location } = useRouterState()

  const sortedChats = useMemo(() => {
    if (!data?.chats) return []

    return [...data.chats].sort(
      (a: any, b: any) =>
        new Date(b.updated_at as string).getTime() - new Date(a.updated_at as string).getTime()
    )
  }, [data?.chats])

  const transformedChats = useMemo(() => {
    return sortedChats.map((chat: any) => ({
      id: chat.id as string,
      name: chat.name as string,
      updated_at: new Date(chat.updated_at as string),
      branch_from: chat.branch_from as string,
      pinned: chat.pinned as boolean,
    }))
  }, [sortedChats])

  const chatGroups = useMemo(() => {
    return categorizeChats(transformedChats)
  }, [transformedChats])

  if (!data?.chats || data.chats.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No chats found</div>
  }

  return (
    <div className="space-y-2 max-h-[calc(100vh-14rem)] overflow-auto no-scrollbar">
      {chatGroups.map((group) => (
        <ChatGroup key={group.label} group={group} currentPath={location.pathname} />
      ))}
    </div>
  )
}
