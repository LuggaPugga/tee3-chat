import { useEffect, useState, useCallback } from "react"

export function useDragAndDrop(onFilesSelected: (files: File[]) => void) {
  const [showDropOverlay, setShowDropOverlay] = useState(false)

  const handleFilesDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [onFilesSelected]
  )

  const hasFiles = useCallback((dataTransfer: DataTransfer | null) => {
    if (!dataTransfer) return false
    
    return Array.from(dataTransfer.types).some(type => 
      type === 'Files' || type.startsWith('application/') || type.startsWith('image/')
    )
  }, [])

  useEffect(() => {
    let dragCounter = 0

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragCounter++
      
      if (hasFiles(e.dataTransfer)) {
        setShowDropOverlay(true)
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounter--
      if (dragCounter === 0) {
        setShowDropOverlay(false)
      }
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      dragCounter = 0
      setShowDropOverlay(false)

      // Only process if actually dropping files
      if (hasFiles(e.dataTransfer)) {
        const files = Array.from(e.dataTransfer?.files || [])
        if (files.length > 0) {
          handleFilesDrop(files)
        }
      }
    }

    document.addEventListener("dragenter", handleDragEnter)
    document.addEventListener("dragleave", handleDragLeave)
    document.addEventListener("dragover", handleDragOver)
    document.addEventListener("drop", handleDrop)

    return () => {
      document.removeEventListener("dragenter", handleDragEnter)
      document.removeEventListener("dragleave", handleDragLeave)
      document.removeEventListener("dragover", handleDragOver)
      document.removeEventListener("drop", handleDrop)
    }
  }, [handleFilesDrop, hasFiles])

  return {
    showDropOverlay,
    setShowDropOverlay,
    handleFilesDrop,
  }
}
