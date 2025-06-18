export default function CancelledChat() {
  return (
    <div
      className="mt-4 flex items-start gap-3 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-900 dark:text-red-400"
      role="alert"
    >
      <div className="leading-relaxed">Stopped by user</div>
    </div>
  )
}
