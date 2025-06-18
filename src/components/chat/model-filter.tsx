import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { filterOptions, type ModelFilters } from "@/lib/ai/filter-options"

interface ModelFilterProps {
  children: React.ReactNode
  filters: ModelFilters
  onFiltersChange: (filters: ModelFilters) => void
}

export function CapabilityBadge({
  icon: Icon,
  color,
  darkColor,
}: {
  icon: React.ElementType
  color: string
  darkColor: string
}) {
  return (
    <div
      style={
        {
          "--badge-color": color,
          "--badge-dark-color": darkColor,
        } as React.CSSProperties
      }
      className={`relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-md text-[var(--badge-color)] dark:text-[var(--badge-dark-color)]`}
    >
      <div className="absolute inset-0 bg-current opacity-20 dark:opacity-15"></div>
      <Icon className="h-4 w-4" />
    </div>
  )
}

export default function ModelFilter({ children, filters, onFiltersChange }: ModelFilterProps) {
  const handleFilterChange = (key: keyof ModelFilters, checked: boolean) => {
    onFiltersChange({
      ...filters,
      [key]: checked,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={20}
        alignOffset={-6}
        className="!outline-1 !outline-chat-border/20 dark:!outline-white/5"
      >
        {Object.values(filters).some(Boolean) && (
          <DropdownMenuItem onClick={() => onFiltersChange({})}>Clear filters</DropdownMenuItem>
        )}
        {Object.values(filters).some(Boolean) && <DropdownMenuSeparator />}
        {filterOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.key}
            checked={filters[option.key] || false}
            onCheckedChange={(checked) => handleFilterChange(option.key, checked)}
            onSelect={(event) => event.preventDefault()}
            className="px-2 group"
          >
            <div className="-ml-0.5 flex items-center gap-2">
              <CapabilityBadge
                icon={option.icon}
                color={option.color}
                darkColor={option.darkColor}
              />
              <span>{option.label}</span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export type { ModelFilters }
