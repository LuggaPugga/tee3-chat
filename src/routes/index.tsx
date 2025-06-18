import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import Chat from "@/components/chat/chat"
import { createChat } from "@/lib/ai/create-chat"
import { useServerFn } from "@tanstack/react-start"
import ChatLayout from "@/components/chat/layout"
import { useRouter } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const router = useRouter()
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const createChatFn = useServerFn(createChat)

  const handlePreSubmit = async (input: string, modelId: string): Promise<string> => {
    const chatId = await createChatFn({
      data: {
        model: modelId,
        messages: input,
      },
    })
    setCurrentChatId(chatId)
    router.history.push(`/chat/${chatId}`)

    return chatId
  }

  return (
    <ChatLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-10 pt-10">
        <Chat chatId={currentChatId || undefined} preSubmit={handlePreSubmit} />
      </div>
    </ChatLayout>
  )
}
