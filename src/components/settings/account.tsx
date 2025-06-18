import { Rocket, Sparkles, Headset, Copy } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { useServerFn } from "@tanstack/react-start"
import { deleteAccount } from "@/lib/delete-account"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"

export default function Account() {
  const deleteAccountFn = useServerFn(deleteAccount)
  const navigate = useNavigate()
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-center text-2xl font-bold md:text-left">Pro Plan Benefits</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex flex-col items-start rounded-lg border border-secondary/40 bg-card/30 px-6 py-4">
            <div className="mb-2 flex items-center">
              <Rocket className="mr-2 h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Access to All Models</span>
            </div>
            <p className="text-sm text-muted-foreground/80">
              Get access to our full suite of models including Claude, o3-mini-high, and more!
            </p>
          </div>

          <div className="flex flex-col items-start rounded-lg border border-secondary/40 bg-card/30 px-6 py-4">
            <div className="mb-2 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Generous Limits</span>
            </div>
            <p className="text-sm text-muted-foreground/80">
              Receive <b>1500 standard credits</b> per month, plus <b>100 premium credits</b>* per
              month.
            </p>
          </div>

          <div className="flex flex-col items-start rounded-lg border border-secondary/40 bg-card/30 px-6 py-4">
            <div className="mb-2 flex items-center">
              <Headset className="mr-2 h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Priority Support</span>
            </div>
            <p className="text-sm text-muted-foreground/80">
              Get faster responses and dedicated assistance from the T3 team whenever you need help!
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 px-4 py-2 w-full md:w-64">
            Manage Subscription
          </button>
        </div>

        <p className="text-sm text-muted-foreground/60">
          <span className="mx-0.5 text-base font-medium">*</span>
          Premium credits are used for GPT Image Gen, Claude Sonnet, and Grok 3. Additional Premium
          credits can be purchased separately.
        </p>
      </div>

      <div className="!mt-20">
        <div className="w-fit space-y-2 border-0 border-muted-foreground/10">
          <h2 className="text-2xl font-bold">Danger Zone</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="px-px py-1.5 text-sm text-muted-foreground/80">
                Permanently delete your account and all associated data.
              </p>
              <div className="flex flex-row gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="border border-red-800/20 bg-red-800/80 hover:bg-red-600 dark:bg-red-800/20 hover:dark:bg-red-800"
                    >
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your account and all associated data. This
                        action cannot be undone.{" "}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-none">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const result = await deleteAccountFn()
                          if (!result) {
                            toast.error("Failed to delete account")
                          } else {
                            navigate({ to: "/" })
                          }
                        }}
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 block md:hidden">
        <div className="w-fit space-y-2">
          <h2 className="text-2xl font-bold">Support Information</h2>
          <div className="space-y-2">
            <p className="px-px py-1.5 text-sm text-muted-foreground/80">
              Your user ID may be requested by our support team to help resolve issues.
            </p>
            <button className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-input/60 disabled:hover:bg-background h-9 px-4 py-2 flex items-center gap-2">
              <span>Copy User ID</span>
              <Copy className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
