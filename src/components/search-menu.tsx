"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { Search, Slash, Plus, Clock } from "lucide-react"
import { db } from "@/utils/instant"
import { useNavigate } from "@tanstack/react-router"

export default function SearchCommandMenu() {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const navigate = useNavigate()
  const auth = db.useAuth()
  const { data } = db.useQuery({
    chats: {
      $: {
        limit: 10,
        order: {
          updated_at: "desc",
        },
        where: {
          ...(auth.user?.id ? { user: auth.user.id } : {}),
          ...(searchValue
            ? {
                name: { $ilike: `%${searchValue}%` },
              }
            : {}),
        },
      },
    },
  })

  const handleChatClick = useCallback(
    (id: string) => {
      if (!id) return
      navigate({ to: "/chat/$chatId", params: { chatId: id } })
      setOpen(false)
    },
    [navigate]
  )

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchValue.trim()) {
        console.log("Starting new chat with:", searchValue)
        setOpen(false)
        setSearchValue("")
      }
    },
    [searchValue]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }

      if ((e.key === "o" || e.key === "O") && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        navigate({ to: "/" })
      }

      if (!open) return

      switch (e.key) {
        case "Escape":
          setOpen(false)
          break
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev < (data?.chats?.length ?? 0) - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
          break
        case "Enter":
          if (selectedIndex >= 0) {
            e.preventDefault()
            const chat = data?.chats?.[selectedIndex]
            if (chat) {
              handleChatClick(chat.id)
            }
          }
          break
        default:
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, selectedIndex, data?.chats, handleChatClick])

  useEffect(() => {
    if (open) {
      setSelectedIndex(-1)
    } else {
      setSearchValue("")
    }
  }, [open])

  useEffect(() => {
    if (searchValue) {
      setSelectedIndex(0)
    } else {
      setSelectedIndex(-1)
    }
  }, [searchValue, data?.chats?.length])

  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSearchSubmit(e)
      }
    },
    [handleSearchSubmit]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay
        className="flex items-center justify-center min-h-screen bg-transparent [&>button]:hidden"
        style={{ pointerEvents: "auto" }}
      />
      <DialogContent
        className="flex items-center justify-center min-h-screen px-0 bg-transparent shadow-none border-none outline-none [&>button]:hidden"
        style={{ pointerEvents: "auto" }}
        showCloseButton={false}
      >
        <div className="pointer-events-auto flex w-full max-w-xl flex-col gap-1 rounded-xl bg-popover p-4 text-secondary-foreground shadow-2xl outline outline-1 outline-border/20 max-sm:inset-x-4 max-sm:w-auto dark:outline-white/5">
          <div>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-start pb-2">
                <div className="flex items-center text-muted-foreground/75">
                  <Search className="ml-px size-4" />
                  <Slash className="ml-1 size-4 skew-x-[30deg] opacity-20" />
                  <Plus className="mr-3 size-4" />
                </div>
                <textarea
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none"
                  role="searchbox"
                  aria-label="Search threads and messages"
                  placeholder="Search or press Enter to start new chat..."
                  style={{ height: "20px" }}
                  rows={1}
                  onKeyDown={handleTextareaKeyDown}
                />
              </div>
            </form>
            <div className="border-b border-border px-3" />
          </div>

          <div className="mt-2.5 max-h-[50vh] space-y-2 overflow-y-auto">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 pl-1 text-sm text-heading">
                {searchValue ? (
                  `Threads (${data?.chats?.length ?? 0})`
                ) : (
                  <>
                    <Clock className="size-3" />
                    Recent Chats
                  </>
                )}
              </div>
              <ul className="flex flex-col text-sm text-muted-foreground">
                {data?.chats?.map((chat, index) => (
                  <li key={chat.id}>
                    <button
                      onClick={() => handleChatClick(chat.id)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left rounded-md px-2.5 py-2 ${
                        selectedIndex === index
                          ? "bg-accent/50 text-foreground"
                          : "hover:bg-accent/30"
                      }`}
                    >
                      {chat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
