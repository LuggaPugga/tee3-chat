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
} from "./ui/alert-dialog"
import { db } from "@/utils/instant"

export default function DeleteChat({
  children,
  threadName,
  onDelete,
  threadId,
}: {
  children: React.ReactNode
  threadName: string
  threadId: string
  onDelete?: () => void
}) {
  const handleDelete = (threadId: string) => {
    if (onDelete) {
      onDelete()
    }

    db.transact(db.tx.chats[threadId].delete())
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Thread</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to delete "{threadName}"? This action cannot be undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(threadId)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
