import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { useServerFn } from "@tanstack/react-start"
import Chat from "@/components/chat/chat"
import ChatLayout from "@/components/chat/layout"
import { createChat } from "@/lib/ai/create-chat"
import { models } from "@/lib/ai/models"

interface NewSearchParams {
  model?: string
  q?: string
}

export const Route = createFileRoute("/new")({
  validateSearch: (search: Record<string, unknown>): NewSearchParams => {
    return {
      model: search.model as string,
      q: search.q as string,
    }
  },
  component: NewChat,
})

function NewChat() {
  const router = useRouter()
  const { model: modelId, q: query } = Route.useSearch()
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false)
  const createChatFn = useServerFn(createChat)

  const selectedModel = models.find((m) => m.id === modelId) || models[1]

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

  useEffect(() => {
    if (query && !currentChatId) {
      const executeQuery = async () => {
        const chatId = await createChatFn({
          data: {
            model: selectedModel.id,
            messages: query,
          },
        })
        setCurrentChatId(chatId)
        setShouldAutoSubmit(true)
        router.history.push(`/chat/${chatId}`)
      }
      executeQuery()
    }
  }, [query, currentChatId, createChatFn, selectedModel.id, router])

  useEffect(() => {
    if (!query && !modelId) {
      router.navigate({ to: "/" })
    }
  }, [query, modelId, router])

  return (
    <ChatLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-10 pt-10">
        <Chat
          chatId={currentChatId || undefined}
          preSubmit={handlePreSubmit}
          initialMessage={shouldAutoSubmit ? query : undefined}
        />
      </div>
    </ChatLayout>
  )
}
