import { useState, useEffect, useCallback, useRef } from "react"

export function useScrollBehavior(chatId?: string) {
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [hasInitialScroll, setHasInitialScroll] = useState(false)
  const lastChatIdRef = useRef<string | undefined>(chatId)

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    })
  }, [])

  const scrollToBottomInstant = useCallback(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "instant",
    })
  }, [])

  const checkScrollPosition = useCallback(() => {
    const { scrollY, innerHeight } = window
    const { scrollHeight } = document.body
    const isAtBottom = scrollY + innerHeight >= scrollHeight - 120
    const hasScroll = scrollHeight > innerHeight + 50
    setShowScrollButton(!isAtBottom && hasScroll)
  }, [])

  useEffect(() => {
    const chatChanged = lastChatIdRef.current !== chatId
    if (chatChanged) {
      setHasInitialScroll(false)
      lastChatIdRef.current = chatId
    }
  }, [chatId])

  const handleInitialScroll = useCallback(
    (hasMessages: boolean) => {
      if (!hasInitialScroll && hasMessages && chatId) {
        setHasInitialScroll(true)

        scrollToBottomInstant()
        checkScrollPosition()
      }
    },
    [hasInitialScroll, scrollToBottomInstant, checkScrollPosition, chatId]
  )

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const debouncedScrollCheck = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(checkScrollPosition, 100) // Increased debounce time
    }

    window.addEventListener("scroll", debouncedScrollCheck, { passive: true })
    window.addEventListener("resize", checkScrollPosition, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener("scroll", debouncedScrollCheck)
      window.removeEventListener("resize", checkScrollPosition)
    }
  }, [checkScrollPosition])

  return {
    showScrollButton,
    scrollToBottom,
    scrollToBottomInstant,
    checkScrollPosition,
    handleInitialScroll,
    hasInitialScroll,
  }
}
