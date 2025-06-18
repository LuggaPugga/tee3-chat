import { useCallback, useState } from "react"

export function useFileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [showFileDrop, setShowFileDrop] = useState(false)

  const addFiles = useCallback((files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files])
    setShowFileDrop(false)
  }, [])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => {
    setSelectedFiles([])
  }, [])

  const toggleFileDrop = useCallback((show: boolean) => {
    setShowFileDrop(show)
  }, [])

  return {
    selectedFiles,
    uploadingFiles,
    showFileDrop,
    setUploadingFiles,
    addFiles,
    removeFile,
    clearFiles,
    toggleFileDrop,
  }
}
