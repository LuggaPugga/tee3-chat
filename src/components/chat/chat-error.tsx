import { Link } from "@tanstack/react-router"

export default function ChatError({
  error,
  link,
}: {
  error: string
  link?: {
    text: string
    to: string
  }
}) {
  return (
    <div
      className="mt-4 flex items-start gap-3 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-900 dark:text-red-400 w-full"
      role="alert"
    >
      <div className="leading-relaxed">
        <span>{error}</span>{" "}
        {link && (
          <Link
            to={link.to}
            className="inline-flex items-center gap-1 text-red-700 underline hover:text-red-800 dark:text-red-200 dark:decoration-red-200 dark:hover:text-red-50"
          >
            {link.text}
          </Link>
        )}
      </div>
    </div>
  )
}
