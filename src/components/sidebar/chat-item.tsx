import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar"
import { Link } from "@tanstack/react-router"
import { GitBranchIcon, PinIcon, PinOffIcon, XIcon, TextCursor, Download } from "lucide-react"
import { memo, useState, useRef, useCallback } from "react"
import { db } from "@/utils/instant"
import DeleteChat from "../delete-chat"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu"
import { cn } from "@/lib/utils"
import { EnrichedChat } from "@/lib/chat/types"
import { downloadChatExport } from "@/lib/export-chat"

export const ChatItem = memo(({ chat, isActive }: { chat: EnrichedChat; isActive: boolean }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(chat.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleTogglePin = useCallback(async () => {
    await db.transact([
      db.tx.chats[chat.id].update({
        pinned: !chat.pinned,
      }),
    ])
  }, [chat.id, chat.pinned])

  const onPinButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleTogglePin()
    },
    [handleTogglePin]
  )

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsEditing(true)
      setEditValue(chat.name)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }, 0)
    },
    [chat.name]
  )

  const handleRename = useCallback(() => {
    setIsEditing(true)
    setEditValue(chat.name)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, 0)
  }, [chat.name])

  const handleSave = useCallback(async () => {
    if (editValue.trim() && editValue.trim() !== chat.name) {
      await db.transact([
        db.tx.chats[chat.id].update({
          name: editValue.trim(),
        }),
      ])
    }
    setIsEditing(false)
  }, [editValue, chat.name, chat.id])

  const handleCancel = useCallback(() => {
    setEditValue(chat.name)
    setIsEditing(false)
  }, [chat.name])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleSave()
      } else if (e.key === "Escape") {
        e.preventDefault()
        handleCancel()
      }
    },
    [handleSave, handleCancel]
  )

  const handleBlur = useCallback(() => {
    handleSave()
  }, [handleSave])

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
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
                      onClick={onPinButtonClick}
                      aria-label={chat.pinned ? "Unpin thread" : "Pin thread"}
                    >
                      {chat.pinned ? (
                        <PinOffIcon className="size-4" />
                      ) : (
                        <PinIcon className="size-4" />
                      )}
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
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={handleTogglePin}>
          {chat.pinned ? (
            <PinOffIcon className="mr-2 size-4" />
          ) : (
            <PinIcon className="mr-2 size-4" />
          )}
          {chat.pinned ? "Unpin" : "Pin"}
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleRename}>
          <TextCursor className="mr-2 size-4" />
          Rename
        </ContextMenuItem>
        <DeleteChat threadName={chat.name} threadId={chat.id}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            <XIcon className="mr-2 size-4" />
            Delete
          </ContextMenuItem>
        </DeleteChat>
        <ContextMenuItem onSelect={() => downloadChatExport(chat.id, chat.name)}>
          <Download className="mr-2 size-4" />
          Export{" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-3 rounded bg-muted px-1 py-0.5 text-xs font-medium uppercase text-muted-foreground">
                beta
              </span>
            </TooltipTrigger>
            <TooltipContent sideOffset={5} side="bottom">
              Some formatting may not work as expected.
            </TooltipContent>
          </Tooltip>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
})

ChatItem.displayName = "ChatItem"
