import { Dialog, DialogDescription, DialogTitle } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { db } from "@/utils/instant"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react"
import { toast } from "sonner"

export default function LoginDialog() {
  const { user } = db.useAuth()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState(0)

  const submitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    db.auth
      .sendMagicCode({ email })
      .then((ctx) => {
        if (ctx.sent) {
          setStep(2)
        } else {
          toast.error("Failed to send code")
        }
      })
      .catch(() => {
        toast.error("Failed to send code")
      })
  }

  const submitCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    db.auth
      .signInWithMagicCode({ code: code, email: email })
      .then((ctx) => {
        if (ctx.user?.id) {
          toast.success("Signed in")
        } else {
          toast.error("Invalid Magic Code")
        }
      })
      .catch(() => {
        toast.error("Invalid Magic Code")
      })
  }

  const Disclaimer = () => (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="text-sm text-muted-foreground">
        This is a clone of the original{" "}
        <a
          href="https://t3.chat"
          target="_blank"
          rel="noopener noreferrer"
          className="text-heading"
        >
          t3.chat
        </a>{" "}
        made for the{" "}
        <a
          href="https://cloneathon.t3.chat/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-heading"
        >
          Cloneathon
        </a>
        .
      </div>
    </div>
  )

  const EmailInstruction = () => <>Enter your email to receive a magic login code.</>

  const CodeInstruction = ({ email }: { email: string }) => (
    <>
      Enter the code sent to <span className="font-semibold text-foreground">{email}</span>.
      <br />
      <span className="text-xs text-muted-foreground">Check your inbox and spam folder.</span>
    </>
  )

  return (
    <Dialog open={!user?.id}>
      <DialogContent className="border-border max-w-sm rounded-xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 0 ? "Disclaimer" : "Sign In"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center mb-4 text-muted-foreground">
          {step === 0 && <Disclaimer />}
          {step === 1 && <EmailInstruction />}
          {step === 2 && <CodeInstruction email={email} />}
        </DialogDescription>
        <div className="flex flex-col gap-4">
          {step === 0 && (
            <div className="flex flex-col items-center justify-center gap-3">
              <Button
                className="w-full bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:bg-primary/90 transition"
                onClick={() => setStep(1)}
              >
                Continue
              </Button>
            </div>
          )}
          {step === 1 && (
            <form onSubmit={submitEmail} className="flex flex-col gap-3">
              <label htmlFor="email" className="hidden" />
              <Input
                placeholder="Email address"
                type="email"
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg px-4 py-2 border"
                required
              />
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:bg-primary/90 transition"
                disabled={!email}
              >
                Send Code
              </Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={submitCode} className="flex flex-col gap-3">
              <Input
                placeholder="Magic Code"
                type="text"
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-lg px-4 py-2 border text-lg text-center"
                required
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 rounded-lg border border-border text-muted-foreground hover:bg-accent"
                  onClick={() => {
                    setStep(1)
                    setCode("")
                  }}
                >
                  ← Go Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:bg-primary/90 transition"
                  disabled={!code}
                >
                  Login
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
