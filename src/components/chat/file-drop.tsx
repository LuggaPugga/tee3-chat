"use client"

import { useState, useEffect, useCallback } from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropProps {
  onFilesDrop?: (files: File[]) => void
  onClose?: () => void
  acceptedFileTypes?: string[]
  maxFileSize?: number // in MB
  maxFiles?: number
  className?: string
  isVisible?: boolean
  selectedFiles?: File[]
}

export default function FileDrop({
  onFilesDrop,
  onClose,
  acceptedFileTypes = [
    ".txt",
    ".md",
    ".pdf",
    ".doc",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
  ],
  maxFileSize = 10,
  maxFiles = 5,
  className,
  isVisible: externalIsVisible,
  selectedFiles = [],
}: FileDropProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [dragDepth, setDragDepth] = useState(0)
  const [internalIsVisible, setInternalIsVisible] = useState(false)

  const isVisible = externalIsVisible !== undefined ? externalIsVisible : internalIsVisible

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setDragDepth((prev) => prev + 1)

    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setInternalIsVisible(true)
      setIsDragActive(true)
    }
  }, [])

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setDragDepth((prev) => {
        const newDepth = prev - 1
        if (newDepth <= 0) {
          setIsDragActive(false)
          if (externalIsVisible === undefined) {
            setInternalIsVisible(false)
          }
          return 0
        }
        return newDepth
      })
    },
    [externalIsVisible]
  )

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDragActive(false)
      if (externalIsVisible === undefined) {
        setInternalIsVisible(false)
      }
      setDragDepth(0)

      const files = Array.from(e.dataTransfer?.files || [])

      if (files.length > 0) {
        const validFiles = files
          .filter((file) => {
            const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
            const isValidType = acceptedFileTypes.some(
              (type) =>
                type.toLowerCase() === fileExtension ||
                file.type.includes(type.replace(".", "")) ||
                (type === ".txt" && file.type === "text/plain") ||
                (type === ".md" && file.type === "text/markdown") ||
                (type === ".pdf" && file.type === "application/pdf")
            )
            const isValidSize = file.size <= maxFileSize * 1024 * 1024
            return isValidType && isValidSize
          })
          .slice(0, maxFiles)

        if (validFiles.length > 0) {
          onFilesDrop?.(validFiles)
        }
      }
    },
    [onFilesDrop, acceptedFileTypes, maxFileSize, maxFiles, externalIsVisible]
  )

  const handleClose = useCallback(() => {
    if (externalIsVisible === undefined) {
      setInternalIsVisible(false)
    }
    setIsDragActive(false)
    setDragDepth(0)
    onClose?.()
  }, [onClose, externalIsVisible])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    },
    [handleClose]
  )

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("dragenter", handleDragEnter)
      document.addEventListener("dragleave", handleDragLeave)
      document.addEventListener("dragover", handleDragOver)
      document.addEventListener("drop", handleDrop)
      document.addEventListener("keydown", handleKeyDown)

      return () => {
        document.removeEventListener("dragenter", handleDragEnter)
        document.removeEventListener("dragleave", handleDragLeave)
        document.removeEventListener("dragover", handleDragOver)
        document.removeEventListener("drop", handleDrop)
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isVisible, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleKeyDown])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "flex items-center justify-center p-8",
        "transition-all duration-300 ease-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      onClick={handleClose}
    >
      <div
        className="w-screen h-screen flex justify-center items-center flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-8 right-8 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <X className="size-6" />
        </button>

        <Upload className="size-26 text-primary mb-4" />

        <h3 className="text-3xl font-bold mb-2 text-white">Add Attachment</h3>
        <p className="text-white/80 mb-2">Drop files here to add them to your message</p>
        <p className="text-white/60 text-sm mb-6">
          Accepted: {acceptedFileTypes.join(", ")} | Max size: {maxFileSize}MB | Max files:{" "}
          {maxFiles}
        </p>

        {selectedFiles.length > 0 && (
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-white/80 text-sm mb-2">Currently selected:</p>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 bg-white/20 rounded px-2 py-1 text-sm text-white"
                >
                  <span className="truncate max-w-32">{file.name}</span>
                  <span className="text-xs text-white/60">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
