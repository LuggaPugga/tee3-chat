import { memo } from "react"
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu } from "../ui/sidebar"
import { PinIcon } from "lucide-react"
import { ChatGroup } from "@/lib/chat/types"
import { ChatItem } from "./chat-item"

export const ChatGroupDisplay = memo(
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
