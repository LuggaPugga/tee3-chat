import { useState, useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { models, providers } from "@/lib/ai/models"
import { ChevronDown, ChevronUp, Filter, Info, Gem, Key, Search, Pin } from "lucide-react"
import type { ModelFilters } from "./model-filter"
import ModelFilter, { CapabilityBadge } from "./model-filter"
import { filterOptions } from "@/lib/ai/filter-options"
import { ModelCard } from "./model-card"
import { usePinnedModels } from "@/hooks/use-pinned-models"
import { Button } from "../ui/button"

function getProviderIcon(provider: string) {
  const providerObj = providers.find((p) => p.id === provider)
  return providerObj?.icon
}

function doesModelMatchFilters(model: any, filters: ModelFilters): boolean {
  const activeFilters = Object.values(filters).some(Boolean)
  if (!activeFilters) return true

  if (filters.fast && !model.abilities?.fast) return false
  if (filters.vision && !model.abilities?.vision) return false
  if (filters.search && !model.abilities?.search && !model.abilities?.web) return false
  if (filters.documents && !model.abilities?.documents) return false
  if (filters.reasoning && !model.abilities?.reasoning) return false
  if (filters.effortControl && !model.abilities?.effort_control) return false
  if (filters.imageGeneration && !model.abilities?.image_generation) return false

  return true
}

export default function ModelSelect({
  model,
  setModel,
}: {
  model: (typeof models)[0]
  setModel: (model: (typeof models)[0]) => void
  selectedModel: (typeof models)[0]
  filters?: ModelFilters
}) {
  const [searchValue, setSearchValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<ModelFilters>({})
  const [showAll, setShowAll] = useState(false)

  const { pinnedModels } = usePinnedModels()

  const allFilteredModels = models.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilters = doesModelMatchFilters(m, filters)
    return matchesSearch && matchesFilters
  })

  const pinnedModelsList = allFilteredModels.filter((m) => pinnedModels.includes(m.id))
  const otherModels = allFilteredModels.filter((m) => !pinnedModels.includes(m.id))

  const modelsToShow = useMemo(() => {
    if (searchValue || showAll) {
      return { pinned: pinnedModelsList, others: otherModels }
    } else {
      return pinnedModelsList
    }
  }, [searchValue, showAll, pinnedModels, otherModels, allFilteredModels])

  const filterButton = useMemo(
    () => (
      <button className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-8 rounded-md text-xs relative gap-2 px-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        {Object.values(filters).some(Boolean) && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-pink-500 select-none pointer-events-none"></span>
        )}
      </button>
    ),
    [filters]
  )

  const renderModelItem = (modelItem: any) => {
    const ProviderIcon = getProviderIcon(modelItem.provider)

    return (
      <DropdownMenuItem
        key={modelItem.id}
        onClick={() => {
          setModel(modelItem)
          setIsOpen(false)
        }}
        className="p-3"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 pr-2 font-medium text-muted-foreground transition-colors">
            {ProviderIcon && <ProviderIcon className="size-4 text-heading" />}
            <span className="w-fit">
              {modelItem.name} {modelItem.sub_text}
            </span>

            {modelItem.premium && (
              <Gem
                className="size-3 text-[--model-muted]"
                style={
                  {
                    "--model-muted": "hsl(var(--muted-foreground))",
                  } as React.CSSProperties
                }
              />
            )}
            {modelItem.abilities?.image_generation && (
              <Key
                className="size-3 text-[--model-muted]"
                style={
                  {
                    "--model-muted": "hsl(var(--muted-foreground))",
                  } as React.CSSProperties
                }
              />
            )}

            <button className="p-1.5" data-state="closed">
              <Info className="size-3 text-heading" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {filterOptions.map(
              (filter) =>
                modelItem.abilities?.[filter.key as keyof typeof modelItem.abilities] && (
                  <CapabilityBadge
                    key={filter.key}
                    icon={filter.icon}
                    color={filter.color}
                    darkColor={filter.darkColor}
                  />
                )
            )}
          </div>
        </div>
      </DropdownMenuItem>
    )
  }

  const renderCategorizedModels = () => {
    if (typeof modelsToShow !== "object" || Array.isArray(modelsToShow)) {
      return null
    }

    const { pinned, others } = modelsToShow

    return (
      <div className="max-h-full overflow-y-scroll px-1.5 sm:w-[640px] scroll-shadow">
        <div className="flex w-full flex-wrap justify-start gap-3.5 pb-4 pl-3 pr-2 pt-2.5">
          {pinned.length > 0 && (
            <>
              <div className="-mb-2 ml-0 flex w-full select-none items-center justify-start gap-1.5 text-heading">
                <Pin className="size-4" />
                Favorites
              </div>
              {pinned.map((modelItem) => (
                <div
                  key={modelItem.id}
                  onClick={() => {
                    setModel(modelItem)
                    setIsOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <ModelCard modelId={modelItem.id} />
                </div>
              ))}
            </>
          )}

          {others.length > 0 && (
            <>
              <div className="-mb-2 ml-2 mt-1 w-full select-none text-heading">Others</div>
              {others.map((modelItem) => (
                <div
                  key={modelItem.id}
                  onClick={() => {
                    setModel(modelItem)
                    setIsOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <ModelCard modelId={modelItem.id} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setSearchValue("")
          setShowAll(false)
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="relative gap-2 -mb-2 text-muted-foreground"
        >
          <div className="text-left text-sm font-medium">
            {model.name}
            <span className="text-xs font-medium text-muted-foreground/80 max-xs:block xs:pl-1.5">
              {model.sub_text}
            </span>
          </div>
          <ChevronDown className="right-0 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        className={`rounded-lg !outline-1 !outline-chat-border/20 dark:!outline-white/5 p-0 pb-11 pt-10 max-w-[calc(100vw-2rem)] transition-[height,width] ease-[cubic-bezier(0.2,0.4,0.1,0.95)] max-sm:mx-4 max-h-[calc(100vh-80px)] ${
          showAll || searchValue ? "sm:w-[640px]" : "sm:w-[420px]"
        } sm:rounded-lg`}
      >
        {showAll || searchValue ? (
          renderCategorizedModels()
        ) : Array.isArray(modelsToShow) && modelsToShow.length > 0 ? (
          modelsToShow.slice(0, 10).map(renderModelItem)
        ) : (
          <DropdownMenuItem>
            <div>No models found</div>
          </DropdownMenuItem>
        )}

        <div className="fixed inset-x-4 bottom-0 flex items-center justify-between rounded-b-lg bg-popover pb-1 pl-1 pr-2.5 pt-1.5 sm:inset-x-0">
          <div className="absolute inset-x-3 top-0 border-b border-chat-border"></div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-9 px-4 py-2 flex items-center gap-2 pl-2 text-sm text-muted-foreground"
          >
            {showAll || searchValue ? (
              <div className="-mb-2 ml-0 flex w-full select-none items-center justify-start gap-1.5 text-color-heading">
                <ChevronDown className="h-4 w-4" />
                <span>Favorites</span>
              </div>
            ) : (
              <>
                <ChevronUp className="h-4 w-4" />
                Show all
                <div className="h-2 w-2 rounded-full bg-pink-500" data-state="closed"></div>
              </>
            )}
          </button>
          <ModelFilter filters={filters} onFiltersChange={setFilters}>
            {filterButton}
          </ModelFilter>
        </div>

        <div className="fixed inset-x-4 top-0 rounded-t-lg bg-popover px-3.5 pt-0.5 sm:inset-x-0">
          <div className="flex items-center">
            <Search className="ml-px mr-3 !size-4 text-muted-foreground/75" />
            <input
              role="searchbox"
              aria-label="Search models"
              placeholder="Search models..."
              className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
              value={searchValue}
              autoFocus
              onChange={(e) => {
                setSearchValue(e.target.value)
                setShowAll(true)
              }}
            />
          </div>
          <div className="border-b border-chat-border px-3"></div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
