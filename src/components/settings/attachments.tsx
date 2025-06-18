import { db } from "@/utils/instant"
import { ExternalLink, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { useState, useCallback } from "react"
import { toast } from "sonner"

export default function Attachments() {
  const { data: attachments } = db.useQuery({
    messages: {
      $files: {
        
      },
    },
  })

  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  const allFiles =
    attachments?.messages?.flatMap((message) => message.$files?.map((file) => file.id) || []) || []

  const handleSelectAll = useCallback(() => {
    setSelectedFiles(new Set(allFiles))
  }, [allFiles])

  const handleClearSelection = useCallback(() => {
    setSelectedFiles(new Set())
  }, [])

  const handleToggleFile = useCallback((fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(fileId)) {
        newSet.delete(fileId)
      } else {
        newSet.add(fileId)
      }
      return newSet
    })
  }, [])

  const handleDeleteSelected = useCallback(async () => {
    if (selectedFiles.size === 0) return

    await Promise.all(
      Array.from(selectedFiles).map((fileId) => db.transact(db.tx.$files[fileId].delete()))
    )
    setSelectedFiles(new Set())
    toast.success(
      `Successfully deleted ${selectedFiles.size} ${selectedFiles.size === 1 ? "file" : "files"}.`
    )
  }, [selectedFiles])

  const handleDeleteSingle = useCallback(async (fileId: string) => {
    await db.transact(db.tx.$files[fileId].delete())
    setSelectedFiles((prev) => {
      const newSet = new Set(prev)
      newSet.delete(fileId)
      return newSet
    })
    toast.success(`Successfully deleted 1 file.`)
  }, [])

  const isAllSelected = allFiles.length > 0 && selectedFiles.size === allFiles.length
  const hasSelection = selectedFiles.size > 0

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Attachments</h2>
        <p className="mt-2 text-sm text-muted-foreground/80 sm:text-base">
          Manage your uploaded files and attachments. Note that deleting files here will remove them
          from the relevant threads, but not delete the threads. This may lead to unexpected
          behavior if you delete a file that is still being used in a thread.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="mb-2 flex h-10 items-end justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isAllSelected ? handleClearSelection : handleSelectAll}
              >
                <div
                  className={`shrink-0 rounded-sm border border-input brightness-75 dark:brightness-200 h-4 w-4 ${isAllSelected ? "bg-primary" : ""}`}
                />
                <span className="text-sm">
                  <span className="hidden md:inline">
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </span>
                  <span className="md:hidden">{isAllSelected ? "None" : "All"}</span>
                </span>
              </Button>
            </div>
            {hasSelection && (
              <Button variant="outline" size="sm" onClick={handleClearSelection}>
                Clear<span className="hidden md:inline"> Selection</span>
              </Button>
            )}
          </div>
          {hasSelection && (
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              <Trash className="size-4" />
              Delete Selected ({selectedFiles.size})
            </Button>
          )}
        </div>
        <div className="relative overflow-x-hidden overflow-y-scroll rounded-lg border border-input">
          <div className="no-scrollbar h-[250px] overflow-y-auto md:h-[calc(100vh-360px)] md:min-h-[670px]">
            {attachments?.messages?.map((message) =>
              message.$files?.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 border-b border-input p-4 last:border-0"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleToggleFile(file.id)}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={selectedFiles.has(file.id)}
                    data-state={selectedFiles.has(file.id) ? "checked" : "unchecked"}
                    value="on"
                    className={`peer shrink-0 rounded-sm border border-input shadow brightness-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:brightness-200 h-4 w-4 ${
                      selectedFiles.has(file.id) ? "bg-primary filter-none" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleFile(file.id)
                    }}
                  ></button>
                  <div className="flex flex-1 items-center justify-between overflow-hidden">
                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        alt="Preview"
                        className="h-12 w-12 shrink-0 rounded object-cover"
                        src={file.url}
                      />
                      <div className="flex min-w-0 flex-col">
                        <div className="flex min-w-0 items-center gap-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex min-w-0 items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="truncate text-sm text-foreground group-hover:underline">
                              {file.path.split("/").pop()}
                            </span>
                            <ExternalLink className="size-4 text-muted-foreground/80 group-hover:text-muted-foreground sm:inline-block" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSingle(file.id)
                      }}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-destructive-foreground shadow-sm disabled:hover:bg-destructive h-9 w-9 border border-red-800/20 bg-red-800/80 hover:bg-red-600 dark:bg-red-800/20 hover:dark:bg-red-800"
                    >
                      <Trash className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
