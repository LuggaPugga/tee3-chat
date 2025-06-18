import { EnrichedChat, ChatGroup } from "./types"

export const DAY_IN_MS = 86400000

export function categorizeChats(chats: EnrichedChat[]): ChatGroup[] {
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
