import { useState, useEffect, useCallback, useRef } from "react"

export function useScrollBehavior(chatId?: string) {
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [hasInitialScroll, setHasInitialScroll] = useState(false)
  const lastChatIdRef = useRef<string | undefined>(chatId)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    scrollContainerRef.current = document.getElementById("chat-scroll-area")
  }, [])

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [])

  const scrollToBottomInstant = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "instant",
      })
    }
  }, [])

  const checkScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 120
    const hasScroll = scrollHeight > clientHeight + 50
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
      if (!hasInitialScroll && hasMessages) {
        setHasInitialScroll(true)
        scrollToBottomInstant()
        checkScrollPosition()
      }
    },
    [hasInitialScroll, scrollToBottomInstant, checkScrollPosition]
  )

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let scrollTimeout: NodeJS.Timeout

    const debouncedScrollCheck = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(checkScrollPosition, 100)
    }

    scrollContainer.addEventListener("scroll", debouncedScrollCheck, { passive: true })
    window.addEventListener("resize", checkScrollPosition, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      scrollContainer.removeEventListener("scroll", debouncedScrollCheck)
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
