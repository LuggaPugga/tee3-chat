import { createFileRoute } from "@tanstack/react-router"
import Chat from "@/components/chat/chat"
import ChatLayout from "@/components/chat/layout"

export const Route = createFileRoute("/chat/$chatId")({
  component: Home,
})

function Home() {
  const { chatId } = Route.useParams()

  return (
    <ChatLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pt-10">
        <Chat chatId={chatId} />
      </div>
    </ChatLayout>
  )
}
