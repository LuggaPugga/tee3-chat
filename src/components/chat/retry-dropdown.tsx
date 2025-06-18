import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { RefreshCcw } from "lucide-react"
import { providers } from "@/lib/ai/models"
import { CapabilityBadge } from "@/components/chat/model-filter"
import { filterOptions } from "@/lib/ai/filter-options"

export default function RetryDropdown({
  children,
  retry,
}: {
  children: React.ReactNode
  retry: (modelId?: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="!outline-1 !outline-chat-border/20 dark:!outline-white/5 min-w-[8rem]">
        <div>
          <DropdownMenuItem onClick={() => retry()} className="px-3! py-2!">
            <RefreshCcw className="h-4 w-4 mr-2 size-4 text-heading" />
            <div className="w-full">Retry same</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-px bg-muted mx-2 my-5 opacity-50" />
          <div className="absolute z-10 -mt-8 flex w-full items-center justify-center">
            <div className="-ml-2 bg-popover px-2 text-sm text-muted-foreground">
              or switch model
            </div>
          </div>
          {providers.map((provider) => (
            <DropdownMenuSub key={provider.id}>
              <DropdownMenuSubTrigger className="relative flex cursor-default select-none items-center gap-2 rounded-sm text-sm outline-none transition-colors focus:bg-accent/30 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 px-3 py-2">
                <div className="flex items-center gap-4 pr-8">
                  <div className="size-4">
                    <provider.icon className="size-4 fill-heading" />
                  </div>
                  {provider.name}
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="!outline-1 !outline-chat-border/20 dark:!outline-white/5 border-none!"
                sideOffset={8}
              >
                {provider.models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => retry(model.id)}
                    className="group flex flex-col items-start gap-1 p-3"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2 pr-2 font-medium text-muted-foreground transition-colors">
                        <provider.icon className="size-4 text-heading" />
                        <span className="w-fit">{model.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {Object.entries(model.abilities ?? {}).map(([key, value]) => {
                          if (!value) return null

                          const filterOption = filterOptions.find((option) => option.key === key)
                          if (!filterOption) return null

                          return (
                            <CapabilityBadge
                              key={filterOption.key}
                              icon={filterOption.icon}
                              color={filterOption.color}
                              darkColor={filterOption.darkColor}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
