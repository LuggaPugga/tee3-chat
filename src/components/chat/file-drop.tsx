import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropProps {
  onFilesDrop?: (files: File[]) => void
  onClose?: () => void
  acceptedFileTypes?: string[]
  maxFileSize?: number
  maxFiles?: number
  className?: string
  isVisible?: boolean
  selectedFiles?: File[]
}

export default function FileDrop({
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
  isVisible = false,
  selectedFiles = [],
}: FileDropProps) {
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
      onClick={onClose}
      onDragOver={(e) => e.preventDefault()}
      onKeyDown={(e) => e.key === "Escape" && onClose}
    >
      <div
        className="w-screen h-screen flex justify-center items-center flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
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
