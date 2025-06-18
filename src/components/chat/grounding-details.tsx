import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown } from "lucide-react"
import { GoogleGenerativeAIProviderMetadata } from "@ai-sdk/google"

interface GroundingDetailsProps {
  data: GoogleGenerativeAIProviderMetadata["groundingMetadata"]
  defaultOpen?: boolean
}

export function GroundingDetails({ data, defaultOpen = false }: GroundingDetailsProps) {
  if (!data) return null

  const webSearchQueries = data.webSearchQueries || []
  const groundingSupports = data.groundingSupports || []

  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? "grounding" : undefined}>
      <AccordionItem value="grounding" className="border-none">
        <AccordionTrigger
          className="items-center gap-2 text-sm text-secondary-foreground flex-row justify-start"
          aria-controls="grounding-content"
        >
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          Search Grounding Details
        </AccordionTrigger>
        <AccordionContent>
          <div id="grounding-content" className="mt-2 space-y-4">
            {webSearchQueries && webSearchQueries.length > 0 && (
              <div className="space-y-2">
                <div className="font-medium text-foreground">Search Queries:</div>
                <div className="space-y-1 text-xs">
                  {webSearchQueries.map((query, index) => (
                    <div key={index}>{query}</div>
                  ))}
                </div>
              </div>
            )}

            {groundingSupports && groundingSupports.length > 0 && (
              <div className="space-y-2">
                <div className="font-medium text-foreground">Grounded Segments:</div>
                {groundingSupports.map((support, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 rounded-md bg-sidebar/40 p-3 dark:bg-chat-accent"
                  >
                    {support.segment && <span className="text-sm">{support.segment.text}</span>}
                    {support.groundingChunkIndices && support.groundingChunkIndices.length > 0 && (
                      <div className="space-y-2">
                        {support.groundingChunkIndices.map((chunkIndex, sourceIndex) => (
                          <div
                            key={sourceIndex}
                            className="flex items-baseline justify-between gap-2 text-xs"
                          >
                            <div className="flex-1">
                              <span className="">
                                Grounding Source {chunkIndex}
                                {support.confidenceScores &&
                                  support.confidenceScores[sourceIndex] && (
                                    <span className="ml-2 text-muted-foreground">
                                      (confidence:{" "}
                                      {(support.confidenceScores[sourceIndex] * 100).toFixed(1)}
                                      %)
                                    </span>
                                  )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
