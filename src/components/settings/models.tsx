import { Link } from "lucide-react"
import { providers } from "@/lib/ai/models"
import { filterOptions } from "@/lib/ai/filter-options"
import { usePinnedModels } from "@/hooks/use-pinned-models"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"

export default function Models() {
  const { isModelPinned, toggleModel, selectRecommendedModels, unselectAllModels } =
    usePinnedModels()

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Available Models</h2>
          <p className="mt-2 text-sm text-muted-foreground/80 sm:text-base">
            Choose which models appear in your model selector. This won't affect existing
            conversations.
          </p>
        </div>
        <div className="flex w-full flex-row items-baseline justify-between gap-3 sm:items-center sm:gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              Filter by features
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={selectRecommendedModels}>
              Select Recommended Models
            </Button>
            <div data-state="closed">
              <Button variant="outline" size="sm" onClick={unselectAllModels}>
                Unselect All
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full space-y-4 overflow-y-auto sm:h-[65vh] sm:min-h-[670px]">
            {providers.map((provider) => (
              <div key={provider.id} className="space-y-3">
                {provider.models.map((model) => {
                  const isSelected = isModelPinned(model.id)

                  return (
                    <div
                      key={model.id}
                      className="relative flex flex-col rounded-lg border border-input p-3 sm:p-4"
                    >
                      <div className="flex w-full items-start gap-4">
                        <div className="relative h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10">
                          <provider.icon className="h-full w-full" />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap items-center gap-1">
                              <h3 className="font-medium">{model.name}</h3>
                            </div>
                            <Switch
                              checked={isSelected}
                              onCheckedChange={() => toggleModel(model.id)}
                            />
                          </div>
                          <div className="relative">
                            <p className="mr-12 text-xs sm:text-sm text-muted-foreground">
                              {model.abilities?.reasoning && "Advanced reasoning capabilities. "}
                              {model.abilities?.vision && "Supports image analysis. "}
                              {model.abilities?.search && "Web search enabled. "}
                              {model.abilities?.documents && "Document processing. "}
                              {model.abilities?.fast && "Optimized for speed. "}
                              {model.premium && "Premium model. "}
                              {model.abilities?.effort_control && "Configurable effort levels. "}
                              {model.abilities?.image_generation && "Image generation. "}
                            </p>
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-1 sm:mt-2 sm:gap-2">
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {filterOptions.map((option) => {
                                const hasFeature = model[option.key as keyof typeof model]
                                if (!hasFeature) return null

                                return (
                                  <div
                                    key={option.key}
                                    style={
                                      {
                                        "--badge-color": option.color,
                                        "--badge-dark-color": option.darkColor,
                                      } as React.CSSProperties
                                    }
                                    className="relative flex items-center gap-1 overflow-hidden rounded-full px-1.5 py-0.5 text-[10px] text-[var(--badge-color)] sm:gap-1.5 sm:px-2 sm:text-xs dark:text-[var(--badge-dark-color)]"
                                    data-state="closed"
                                  >
                                    <div className="absolute inset-0 bg-current opacity-20 dark:opacity-15"></div>
                                    <option.icon className="h-2.5 w-2.5 brightness-75 sm:h-3 sm:w-3 dark:filter-none" />
                                    <span className="whitespace-nowrap brightness-75 dark:filter-none">
                                      {option.label}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                            <button className="items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-8 rounded-md px-3 text-xs hidden text-muted-foreground sm:flex">
                              <Link className="mr-1.5 h-2 w-2" />
                              Search URL
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
