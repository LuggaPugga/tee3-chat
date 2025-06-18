import { SearchIcon } from "lucide-react"

export default function Search({
  search,
  setSearch,
}: {
  search: string
  setSearch: (search: string) => void
}) {
  return (
    <div className="border-b border-chat-border px-3">
      <div className="flex items-center">
        <SearchIcon className="lucide lucide-search -ml-[3px] mr-3 !size-4 text-muted-foreground" />
        <input
          type="text"
          role="searchbox"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search threads"
          placeholder="Search your threads..."
          className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
        />
      </div>
    </div>
  )
}
