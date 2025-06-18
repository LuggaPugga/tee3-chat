import { Button } from "@/components/ui/button"
import { KeyIcon, CheckIcon, TrashIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { uploadApiKey } from "@/utils/upload-api-key"
import { useServerFn } from "@tanstack/react-start"
import { db } from "@/utils/instant"
import { ApiProviders } from "@/lib/ai/models"

const providers = ApiProviders

export default function ApiKeys() {
  const [keys, setKeys] = useState<{ [provider: string]: string }>({})
  const [configuredKeys, setConfiguredKeys] = useState<{ [provider: string]: boolean }>({})
  const [isLoading, setIsLoading] = useState<{ [provider: string]: boolean }>({})

  useEffect(() => {
    const fetchApiKeys = async () => {
      const apiKeys = await db.queryOnce({ apiKeys: {} })
      const configured =
        apiKeys.data.apiKeys?.reduce(
          (acc, key) => {
            acc[key.provider || ""] = true
            return acc
          },
          {} as { [provider: string]: boolean }
        ) || {}
      setConfiguredKeys(configured)
    }
    fetchApiKeys()
  }, [])

  const uploadApiKeyFn = useServerFn(uploadApiKey)

  const handleKeyChange = (provider: string, value: string) => {
    setKeys((prev) => ({ ...prev, [provider]: value }))
  }

  const handleSaveKey = async (provider: string) => {
    const key = keys[provider]?.trim()
    if (!key) return

    setIsLoading((prev) => ({ ...prev, [provider]: true }))

    try {
      const successful = await uploadApiKeyFn({
        data: {
          key,
          provider,
        },
      })

      if (!successful) {
        throw new Error("Failed to save API key")
      }

      setKeys((prev) => ({ ...prev, [provider]: "" }))
      setConfiguredKeys((prev) => ({ ...prev, [provider]: true }))
    } catch (error) {
      console.error(`Failed to save ${provider} API key:`, error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  const handleDeleteKey = async (provider: string) => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }))

    try {
      // Find and delete the API key from instant db
      const apiKeys = await db.queryOnce({ apiKeys: {} })
      const keyToDelete = apiKeys.data.apiKeys?.find((key) => key.provider === provider)

      if (keyToDelete) {
        await db.transact(db.tx.apiKeys[keyToDelete.id].delete())
        setConfiguredKeys((prev) => ({ ...prev, [provider]: false }))
      }
    } catch (error) {
      console.error(`Failed to delete ${provider} API key:`, error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">API Keys</h2>
        <p className="text-muted-foreground">
          Manage your API keys for external integrations and services.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-6">
          {providers.map((provider) => (
            <div key={provider.id} className="space-y-4 rounded-lg border border-input p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyIcon className="size-4" />
                    <h3 className="font-semibold">{provider.name} API Key</h3>
                  </div>
                  {configuredKeys[provider.id] && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteKey(provider.id)}
                        disabled={isLoading[provider.id]}
                        className="h-9 w-9 p-0"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Used for the following models:</p>
                <div className="flex flex-wrap gap-2">
                  {provider.models.map((model) => (
                    <span key={model.id} className="rounded-full bg-secondary px-2 py-1 text-xs">
                      {model.name}
                    </span>
                  ))}
                </div>
                {provider.description && (
                  <div className="mt-3 rounded-md bg-muted p-3">
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                  </div>
                )}
              </div>

              {configuredKeys[provider.id] ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  API key configured
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <input
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder={provider.placeholder}
                      type="password"
                      value={keys[provider.id] || ""}
                      onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                      disabled={isLoading[provider.id]}
                    />
                    <p className="prose prose-pink text-xs text-muted-foreground">
                      Get your API key from{" "}
                      <a
                        href={provider.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline hover:underline"
                      >
                        {provider.name}'s Console
                      </a>
                    </p>
                  </div>
                  <div className="flex w-full justify-end gap-2">
                    <Button
                      onClick={() => handleSaveKey(provider.id)}
                      disabled={!keys[provider.id]?.trim() || isLoading[provider.id]}
                    >
                      {isLoading[provider.id] ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
