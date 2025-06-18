import { models, providers } from "@/lib/ai/models"
import { filterOptions } from "@/lib/ai/filter-options"
import { CapabilityBadge } from "@/components/chat/model-filter"
import { PinIcon, PinOffIcon } from "lucide-react"
import { usePinnedModels } from "@/hooks/use-pinned-models"

export function ModelCard({ modelId }: { modelId: string }) {
  const model = models.find((model) => model.id === modelId)
  const { isModelPinned, toggleModel } = usePinnedModels()

  function getProviderIcon(provider: string) {
    const providerObj = providers.find((p) => p.id === provider)
    const IconComponent = providerObj?.icon
    return IconComponent ? <IconComponent className="size-7 text-muted-foreground" /> : null
  }

  const getModelNameParts = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return {
        primary: parts[0],
        secondary: parts.slice(1).join(" "),
      }
    }
    return {
      primary: name,
      secondary: "",
    }
  }

  const nameParts = getModelNameParts(model?.name || "")
  const isPinned = isModelPinned(modelId)

  const handlePinClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await toggleModel(modelId)
  }

  return (
    <button className="group relative flex h-[148px] w-[108px] cursor-pointer flex-col items-start gap-0.5 overflow-visible rounded-xl border border-chat-border/50 bg-sidebar/20 px-1 py-3 text-color-heading [--model-muted:hsl(var(--muted-foreground)/0.9)] [--model-primary:hsl(var(--color-heading))] hover:bg-accent/30 hover:text-color-heading dark:border-chat-border dark:bg-[hsl(320,20%,2.9%)] dark:[--model-muted:hsl(var(--color-heading))] dark:[--model-primary:hsl(var(--muted-foreground)/0.9)] dark:hover:bg-accent/30">
      <div className="flex w-full flex-col items-center justify-center gap-1 font-medium transition-colors">
        {getProviderIcon(model?.provider ?? "")}
        <div className="w-full text-center text-muted-foreground">
          <div className="text-base font-semibold">{nameParts.primary}</div>
          {nameParts.secondary && (
            <div className="-mt-0.5 text-sm font-semibold">{nameParts.secondary}</div>
          )}
          {model?.sub_text && (
            <div className="-mt-1 text-[11px] text-heading">{model.sub_text}</div>
          )}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-3 flex w-full items-center justify-center gap-2">
        {filterOptions.map(
          (filter) =>
            model?.abilities?.[filter.key as keyof typeof model.abilities] && (
              <CapabilityBadge
                key={filter.key}
                icon={filter.icon}
                color={filter.color}
                darkColor={filter.darkColor}
              />
            )
        )}
      </div>
      <div className="absolute -right-1.5 -top-1.5 left-auto z-50 flex w-auto translate-y-2 scale-95 items-center rounded-[10px] border border-chat-border/40 bg-card p-1 text-xs text-muted-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <button
          className="cursor-pointer rounded-md bg-accent/30 p-1.5 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
          tabIndex={-1}
          data-action="pin-thread"
          aria-label={isPinned ? "Unpin model" : "Pin model"}
          onClick={handlePinClick}
        >
          {isPinned ? <PinOffIcon className={`size-4`} /> : <PinIcon className={`size-4`} />}
        </button>
      </div>
    </button>
  )
}
