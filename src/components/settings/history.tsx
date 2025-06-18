import { Download, Pin, Trash2, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { db } from "@/utils/instant"
import { useMemo, useState } from "react"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../ui/checkbox"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "../ui/alert-dialog"

type Chat = {
  id: string
  name: string
  created_at: string
  updated_at: string
  model?: string
  pinned?: boolean
}

export default function History() {
  const auth = db.useAuth()
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  const { data, isLoading } = db.useQuery({
    chats: {
      $: {
        limit: 100,
        where: auth.user?.id ? { user: auth.user.id } : undefined,
        order: {
          serverCreatedAt: "desc",
        },
      },
    },
  })

  const deleteChat = async (selectedRowIndices: string[]) => {
    if (selectedRowIndices.length === 0) return

    const chatIdsToDelete = selectedRowIndices.map((rowIndex) => {
      const rowData = table.getRow(rowIndex).original
      return rowData.id
    })

    await db.transact(chatIdsToDelete.map((chatId) => db.tx.chats[chatId].delete()))
    setRowSelection({})
  }

  const deleteAllChatHistory = async () => {
    if (!auth.user?.id) return

    const allChatIds = chats.map((chat) => chat.id)
    await db.transact(allChatIds.map((chatId) => db.tx.chats[chatId].delete()))
  }

  const chats = useMemo(() => {
    if (!data?.chats) return []
    return data.chats.map((chat: any) => ({
      id: chat.id,
      name: chat.name || "Untitled Chat",
      created_at: chat.created_at,
      updated_at: chat.updated_at,
      model: chat.model,
      pinned: chat.pinned,
    })) as Chat[]
  }, [data?.chats])

  const columns = useMemo<ColumnDef<Chat>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            className="brightness-75 dark:brightness-200"
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            className="brightness-75 dark:brightness-200"
            checked={row.getIsSelected()}
            onCheckedChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 40,
      },
      {
        accessorKey: "name",
        header: "Chat Name",
        cell: ({ getValue }) => <span className="truncate">{getValue() as string}</span>,
      },
      {
        id: "pinned",
        header: "",
        cell: ({ row }) => (
          <span className="flex w-12 justify-end pr-4">
            <Pin className={`size-4 ${row.original.pinned ? "text-primary" : "invisible"}`} />
          </span>
        ),
        size: 48,
      },
      {
        accessorKey: "updated_at",
        header: "Last Updated",
        cell: ({ getValue }) => {
          const dateValue = getValue() as string
          const date = new Date(dateValue)
          return (
            <span className="w-[24ch] select-none text-right text-xs text-muted-foreground">
              {date.toLocaleString()}
            </span>
          )
        },
        size: 200,
      },
    ],
    []
  )

  const table = useReactTable({
    data: chats,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  const selectedRowCount = Object.keys(rowSelection).length
  const hasSelection = selectedRowCount > 0
  const allSelected = table.getIsAllPageRowsSelected()

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Message History</h1>
        <div className="space-y-6">
          <p className="text-muted-foreground/80">
            Save your history as JSON, or import someone else's. Importing will NOT delete existing
            messages
          </p>
          <div className="space-y-2">
            <div className="mb-2 flex h-10 items-end justify-between gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center whitespace-nowrap gap-2.5"
                    onClick={() => table.toggleAllPageRowsSelected()}
                  >
                    <Checkbox checked={allSelected} className="brightness-75 dark:brightness-200" />
                    <span className="hidden text-sm md:inline">Select All</span>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-1 whitespace-nowrap ${!hasSelection ? "invisible" : ""}`}
                  onClick={() => setRowSelection({})}
                >
                  Clear<span className="hidden md:inline"> Selection</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" disabled={!hasSelection}>
                  <Upload />
                  <span className="sr-only md:not-sr-only">
                    Export{hasSelection ? ` (${selectedRowCount})` : ""}
                  </span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={() => deleteChat(Object.keys(rowSelection))}
                  disabled={!hasSelection}
                >
                  <Trash2 />
                  <span className="sr-only md:not-sr-only">
                    Delete{hasSelection ? ` (${selectedRowCount})` : ""}
                  </span>
                </Button>
                <Button variant="outline" size="sm">
                  <Download />
                  <span className="hidden md:inline">Import</span>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">Loading chats...</div>
            ) : chats.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No chats found</div>
            ) : (
              <div>
                <ul className="w-full divide-y overflow-y-scroll rounded border border-border max-h-[15rem] min-h-[15rem]">
                  {table.getRowModel().rows.map((row) => (
                    <li
                      key={row.id}
                      className="grid cursor-pointer grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-2 hover:bg-muted/50 border-border"
                      style={{ minHeight: "2.5rem" }}
                      onClick={(e) => {
                        // Prevent row click when clicking on the checkbox directly
                        if ((e.target as HTMLElement).closest('[role="checkbox"]')) return
                        row.toggleSelected()
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <div key={cell.id} className={cell.column.id === "name" ? "truncate" : ""}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Danger Zone</h1>
        <div className="space-y-2 ">
          <p className="px-px py-1.5 text-sm text-muted-foreground/80">
            Permanently delete your history from both your local device and our servers.
            <span className="mx-0.5 text-base font-medium">*</span>
          </p>
          <div className="flex flex-row gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="border border-red-800/20 bg-red-800/80 hover:bg-red-600 dark:bg-red-800/20 hover:dark:bg-red-800"
                >
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete Chat History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  This will permanently delete all your chat history from both your device and our
                  servers (if sync is enabled). This action cannot be undone.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAllChatHistory}>
                    Delete History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </section>
    </div>
  )
}
