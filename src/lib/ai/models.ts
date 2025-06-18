import {
  OpenAIIcon,
  GeminiIcon,
  AnthropicIcon,
  DeepSeekIcon,
  XAIIcon,
  LlamaIcon,
  QwenIcon,
} from "@/components/icons"

export interface Model {
  id: string
  providerId: string
  openRouterId?: string
  name: string
  provider: string
  abilities?: {
    search?: boolean
    reasoning?: boolean
    vision?: boolean
    documents?: boolean
    image_generation?: boolean
    fast?: boolean
    effort_control?: boolean
  }
  premium?: boolean
  sub_text?: string
  apiProvider: string
}

export interface Provider {
  id: string
  name: string
  models: Model[]
  icon: React.ElementType
}

export interface ApiProvider {
  id: string
  name: string
  models: Model[]
  placeholder: string
  docUrl: string
  description?: string
}

export function getModelName(id: string) {
  return models.find((model) => model.id === id)?.name
}

export const models: Model[] = [
  {
    providerId: "chatgpt-4o-latest",
    id: "chatgpt-4o-latest",
    name: "GPT 4o",
    provider: "openai",
    openRouterId: "openai/gpt-4o-latest",
    apiProvider: "openai",
    abilities: {
      vision: true,
    },
  },
  {
    providerId: "gpt-4o-mini",
    id: "gpt-4o-mini",
    name: "GPT 4o Mini",
    provider: "openai",
    openRouterId: "openai/gpt-4o-mini",
    apiProvider: "openai",
    abilities: {
      vision: true,
    },
  },
  {
    providerId: "gpt-4.1",
    id: "gpt-4.1",
    name: "GPT 4.1",
    provider: "openai",
    openRouterId: "openai/gpt-4.1",
    apiProvider: "openai",
    abilities: {
      vision: true,
    },
  },
  {
    providerId: "gpt-4.1",
    id: "gpt-4.1-mini",
    name: "GPT 4.1 Mini",
    provider: "openai",
    openRouterId: "openai/gpt-4.1-mini",
    apiProvider: "openai",
    abilities: {
      vision: true,
    },
  },
  {
    providerId: "gpt-4.1-nano",
    id: "gpt-4.1-nano",
    name: "GPT 4.1 Nano",
    provider: "openai",
    apiProvider: "openai",
    abilities: {
      vision: true,
    },
  },
  {
    providerId: "o3-mini",
    id: "o3-mini",
    name: "o3 Mini",
    provider: "openai",
    openRouterId: "openai/o3-mini",
    apiProvider: "openai",
    abilities: {
      reasoning: true,
      effort_control: true,
    },
  },
  {
    providerId: "o3",
    id: "o3",
    name: "o3",
    provider: "openai",
    premium: true,
    apiProvider: "openai",
    abilities: {
      reasoning: true,
      effort_control: true,
    },
  },
  {
    providerId: "o4-mini",
    id: "o4-mini",
    name: "o4 Mini",
    provider: "openai",
    openRouterId: "openai/o4-mini",
    apiProvider: "openai",
    abilities: {
      reasoning: true,
      vision: true,
      effort_control: true,
    },
  },
  {
    providerId: "deepseek/deepseek-r1-0528",
    id: "deepseek-r1-0528",
    name: "DeepSeek R1 0528",
    provider: "deepseek",
    apiProvider: "openrouter",
    abilities: {
      reasoning: true,
    },
  },
  {
    providerId: "deepseek/deepseek-r1-distill-qwen-7b",
    id: "deepseek/deepseek-r1-distill-qwen-7b",
    name: "DeepSeek R1",
    sub_text: "(Qwen Distilled)",
    provider: "deepseek",
    apiProvider: "openrouter",
    abilities: {
      reasoning: true,
    },
  },
  {
    providerId: "deepseek/deepseek-r1-distill-llama-70b",
    id: "deepseek-r1-distill-llama",
    name: "DeepSeek R1",
    sub_text: "(Llama Distilled)",
    provider: "deepseek",
    apiProvider: "openrouter",
    abilities: {
      reasoning: true,
    },
  },
  {
    providerId: "deepseek/deepseek-chat-v3-0324",
    id: "deepseek-v3-0324",
    name: "DeepSeek Chat v3",
    sub_text: "(0324)",
    provider: "deepseek",
    apiProvider: "openrouter",
  },
  {
    providerId: "gemini-2.0-flash",
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    openRouterId: "google/gemini-2.0-flash",
    apiProvider: "google",
    abilities: {
      search: true,
      documents: true,
      vision: true,
    },
  },
  {
    providerId: "gemini-2.0-flash-lite",
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    provider: "google",
    openRouterId: "google/gemini-2.0-flash-lite",
    apiProvider: "google",
    abilities: {
      search: true,
      documents: true,
      vision: true,
    },
  },
  {
    providerId: "gemini-2.5-flash-preview-04-17",
    id: "gemini-2.5-flash-preview-04-17",
    name: "Gemini 2.5 Flash",
    openRouterId: "google/gemini-2.5-flash-preview-04-17",
    provider: "google",
    apiProvider: "google",
    abilities: {
      search: true,
      vision: true,
      documents: true,
    },
  },
  {
    providerId: "gemini-2.5-flash-preview-05-20",
    id: "gemini-2.5-flash-preview-05-20",
    openRouterId: "google/gemini-2.5-flash-preview-05-20",
    name: "Gemini 2.5 Flash",
    sub_text: "(Reasoning)",
    provider: "google",
    apiProvider: "google",
    abilities: {
      reasoning: true,
      search: true,
      vision: true,
      documents: true,
    },
  },
  {
    providerId: "gemini-2.5-pro-preview-06-05",
    openRouterId: "google/gemini-2.5-pro-preview-05-06",
    id: "Gemini 2.5 Pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    apiProvider: "google",
    abilities: {
      search: true,
      reasoning: true,
      documents: true,
    },
  },
  {
    id: "claude-4-sonnet",
    providerId: "claude-4-sonnet-20250514",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    openRouterId: "anthropic/claude-sonnet-4",
    apiProvider: "anthropic",
    premium: true,
    abilities: {
      vision: true,
      documents: true,
    },
  },
  {
    id: "claude-4-sonnet-reasoning",
    providerId: "claude-4-sonnet-20250514",
    name: "Claude Sonnet 4",
    sub_text: "(Reasoning)",
    provider: "anthropic",
    openRouterId: "anthropic/claude-sonnet-4:thinking",
    apiProvider: "anthropic",
    premium: true,
    abilities: {
      reasoning: true,
      effort_control: true,
      vision: true,
      documents: true,
    },
  },
  {
    providerId: "claude-3-7-sonnet-20250219",
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    provider: "anthropic",
    apiProvider: "anthropic",
    openRouterId: "anthropic/claude-3.7-sonnet",
    premium: true,
    abilities: {
      vision: true,
      documents: true,
    },
  },
  {
    providerId: "claude-3-7-sonnet-20250219",
    id: "claude-3-7-sonnet-thinking",
    name: "Claude 3.7 Sonnet",
    sub_text: "(Reasoning)",
    provider: "anthropic",
    apiProvider: "anthropic",
    openRouterId: "anthropic/claude-3.7-sonnet:thinking",
    premium: true,
    abilities: {
      vision: true,
      documents: true,
    },
  },
  {
    providerId: "claude-3-5-sonnet-latest",
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    apiProvider: "anthropic",
    openRouterId: "anthropic/claude-3.5-sonnet",
    premium: true,
    abilities: {
      vision: true,
      documents: true,
    },
  },
  {
    providerId: "x-ai/grok-3-beta",
    id: "grok-3",
    name: "Grok 3",
    premium: true,
    provider: "xAI",
    apiProvider: "openrouter",
  },
  {
    providerId: "x-ai/grok-3-mini-beta",
    id: "grok-3-mini",
    name: "Grok 3 Mini",
    provider: "xAI",
    apiProvider: "openrouter",
    abilities: {
      reasoning: true,
    },
  },
  {
    providerId: "qwen/qwen2.5-vl-32b-instruct",
    id: "qwen2.5-vl-32b",
    name: "Qwen 2.5 32b",
    provider: "qwen",
    apiProvider: "openrouter",
    abilities: {
      vision: true,
    },
  },
  {
    providerId: "qwen/qwq-32b",
    id: "qwq-32b",
    name: "Qwen qwq-32b",
    provider: "qwen",
    apiProvider: "openrouter",
    abilities: {
      vision: true,
    },
  },
  {
    providerId: "meta-llama/llama-3.3-70b-instruct",
    id: "llama-3.3-70b",
    name: "Llama 3.3 70b",
    provider: "llama",
    apiProvider: "openrouter",
  },
  {
    providerId: "meta-llama/llama-4-scout",
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    provider: "llama",
    apiProvider: "openrouter",
    abilities: {
      vision: true,
    },
  },
  {
    providerId: "meta-llama/llama-4-mavrick",
    id: "llama-4-mavrick",
    name: "Llama 4 Mavrick",
    provider: "llama",
    apiProvider: "openrouter",
    abilities: {
      vision: true,
    },
  },
]

export const providers: Provider[] = [
  {
    id: "google",
    name: "Gemini",
    icon: GeminiIcon,
    models: models.filter((model) => model.provider === "google"),
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: OpenAIIcon,
    models: models.filter((model) => model.provider === "openai"),
  },
  {
    id: "anthropic",
    name: "Claude",
    icon: AnthropicIcon,
    models: models.filter((model) => model.provider === "anthropic"),
  },
  {
    id: "llama",
    name: "Llama",
    icon: LlamaIcon,
    models: models.filter((model) => model.provider === "llama"),
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: DeepSeekIcon,
    models: models.filter((model) => model.provider === "deepseek"),
  },
  {
    id: "xAI",
    name: "Grok",
    icon: XAIIcon,
    models: models.filter((model) => model.provider === "xAI"),
  },
  {
    id: "qwen",
    name: "Qwen",
    icon: QwenIcon,
    models: models.filter((model) => model.provider === "qwen"),
  },
]

export const ApiProviders: ApiProvider[] = [
  {
    id: "google",
    name: "Google",
    models: models.filter((model) => model.apiProvider === "google"),
    placeholder: "AI...",
    docUrl: "https://aistudio.google.com/apikey",
  },
  {
    id: "openai",
    name: "OpenAI",
    models: models.filter((model) => model.apiProvider === "openai"),
    placeholder: "sk-...",
    docUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: models.filter((model) => model.apiProvider === "anthropic"),
    placeholder: "sk-ant-...",
    docUrl: "https://console.anthropic.com/account/keys",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    models: models.filter((model) => model.apiProvider === "openrouter"),
    placeholder: "sk-...",
    docUrl: "https://openrouter.ai/docs/api-keys",
    description:
      "OpenRouter provides access to many models including OpenAI, Claude, and others. It will be used as a fallback for any model when the native provider's API key is not configured.",
  },
]
