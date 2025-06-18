import { Input } from '@/components/ui/input';
import { db } from '@/utils/instant';
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const inputEl = useRef<HTMLInputElement>(null);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.auth.sendMagicCode({ email }).then(() => {
      setSentEmail(email);
      setStep(2);
    }).catch((err) => {
      alert('Uh oh :' + err.body?.message);
      setEmail('');
    });
  };

  const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.auth.signInWithMagicCode({ email: sentEmail, code }).catch((err) => {
      if (inputEl.current) {
        inputEl.current.value = '';
      }
      alert('Uh oh :' + err.body?.message);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-card p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">
            {step === 1 ? 'Enter your email to receive a magic link' : 'Enter the code sent to your email'}
          </p>
        </div>
        {step === 1 ? (
          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Send Magic Link
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleCodeSubmit}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                Verification Code
              </label>
              <Input
                ref={inputEl}
                id="code"
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Verify Code
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
