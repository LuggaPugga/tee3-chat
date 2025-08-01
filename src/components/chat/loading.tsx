export default function Loading() {
  return (
    <div className="group relative max-w-full">
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-secondary-foreground/40 [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-secondary-foreground/40 [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-secondary-foreground/40"></div>
      </div>
    </div>
  )
}
