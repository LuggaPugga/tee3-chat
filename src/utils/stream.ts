export function streamAsyncIterator(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder("utf-8")
  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) return
          yield decoder.decode(value)
        }
      } finally {
        reader.releaseLock()
      }
    },
  }
}

export async function processStreamResponse(
  response: Response,
  onChunk: (content: string, reasoning?: string, error?: string) => void
): Promise<void> {
  if (!response.body) {
    throw new Error("Response body is empty")
  }

  const reader = response.body.getReader()
  let assistantResponse = ""
  let reasoningContent = ""

  try {
    for await (const chunk of streamAsyncIterator(reader)) {
      const lines = chunk.split("\n").filter((line) => line.trim())

      for (const line of lines) {
        console.log("line", line)
        if (line.startsWith("0:")) {
          try {
            const data = JSON.parse(line.slice(2))
            if (data && typeof data === "string") {
              assistantResponse += data
              onChunk(assistantResponse, reasoningContent)
            }
          } catch (e) {}
        } else if (line.startsWith("g:")) {
          try {
            const data = JSON.parse(line.slice(2))
            if (data && typeof data === "string") {
              reasoningContent += data
              onChunk(assistantResponse, reasoningContent)
            }
          } catch (e) {
            console.error(e)
          }
        } else if (line.startsWith("3:")) {
          try {
            const data = JSON.parse(line.slice(2))
            if (data && typeof data === "string") {
              onChunk(assistantResponse, reasoningContent, data)
            }
          } catch (e) {
            console.error(e)
          }
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}
