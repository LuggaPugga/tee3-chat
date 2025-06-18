export type EnrichedChat = {
  id: string
  name: string
  updated_at: Date
  branch_from: string | null
  pinned?: boolean
  branch_from_name?: string
}

export interface ChatGroup {
  label: string
  chats: EnrichedChat[]
}
