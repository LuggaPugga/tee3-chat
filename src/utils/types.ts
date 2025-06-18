export type Message = {
  id: string
  role: "user" | "assistant"
  content: {
    type: "text"
    text: string
  }[]
  model: string
}
