import { Zap, Eye, Globe, FileText, Brain, Settings2, ImagePlus } from "lucide-react"

export interface ModelFilters {
  fast?: boolean
  vision?: boolean
  search?: boolean
  documents?: boolean
  reasoning?: boolean
  effortControl?: boolean
  imageGeneration?: boolean
}
export const filterOptions = [
  {
    key: "fast" as keyof ModelFilters,
    label: "Fast",
    icon: Zap,
    color: "hsl(46, 77%, 52%)",
    darkColor: "hsl(46, 77%, 79%)",
  },
  {
    key: "vision" as keyof ModelFilters,
    label: "Vision",
    icon: Eye,
    color: "hsl(168, 54%, 52%)",
    darkColor: "hsl(168, 54%, 74%)",
  },
  {
    key: "search" as keyof ModelFilters,
    label: "Search",
    icon: Globe,
    color: "hsl(208, 56%, 52%)",
    darkColor: "hsl(208, 56%, 74%)",
  },
  {
    key: "documents" as keyof ModelFilters,
    label: "PDFs",
    icon: FileText,
    color: "hsl(237, 55%, 57%)",
    darkColor: "hsl(237, 75%, 77%)",
  },
  {
    key: "reasoning" as keyof ModelFilters,
    label: "Reasoning",
    icon: Brain,
    color: "hsl(263, 58%, 53%)",
    darkColor: "hsl(263, 58%, 75%)",
  },
  {
    key: "effortControl" as keyof ModelFilters,
    label: "Effort Control",
    icon: Settings2,
    color: "hsl(304, 44%, 51%)",
    darkColor: "hsl(304, 44%, 72%)",
  },
  {
    key: "imageGeneration" as keyof ModelFilters,
    label: "Image Generation",
    icon: ImagePlus,
    color: "hsl(12, 60%, 45%)",
    darkColor: "hsl(12, 60%, 60%)",
  },
]
