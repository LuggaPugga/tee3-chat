import { db } from "@/utils/instant"
import { recommendedModels } from "@/lib/ai/recommended-models"
import { id } from "@instantdb/react"

export function usePinnedModels() {
  const { user } = db.useAuth()
  const { data } = db.useQuery({
    preferences: {},
  })

  const selectedModels =
    data?.preferences[0]?.pinned_models || recommendedModels.map((model) => model.id)

  const updatePinnedModels = async (newPinnedModels: string[]) => {
    const existingPreference = data?.preferences[0]

    if (existingPreference) {
      await db.transact(
        db.tx.preferences[existingPreference.id]
          .update({
            pinned_models: newPinnedModels,
          })
          .link({ user: user?.id ?? "" })
      )
    } else {
      const preferencesId = id()
      await db.transact(
        db.tx.preferences[preferencesId]
          .update({
            name: "user_preferences",
            pinned_models: newPinnedModels,
          })
          .link({ user: user?.id ?? "" })
      )
    }
  }

  const toggleModel = async (modelId: string) => {
    const currentSelected = Array.isArray(selectedModels) ? selectedModels : []
    const newSelected = currentSelected.includes(modelId)
      ? currentSelected.filter((id) => id !== modelId)
      : [...currentSelected, modelId]

    await updatePinnedModels(newSelected)
  }

  const pinModel = async (modelId: string) => {
    const currentSelected = Array.isArray(selectedModels) ? selectedModels : []
    if (!currentSelected.includes(modelId)) {
      await updatePinnedModels([...currentSelected, modelId])
    }
  }

  const unpinModel = async (modelId: string) => {
    const currentSelected = Array.isArray(selectedModels) ? selectedModels : []
    await updatePinnedModels(currentSelected.filter((id) => id !== modelId))
  }

  const selectRecommendedModels = async () => {
    const recommendedModelIds = recommendedModels.map((model) => model.id)
    await updatePinnedModels(recommendedModelIds)
  }

  const unselectAllModels = async () => {
    await updatePinnedModels([])
  }

  const isModelPinned = (modelId: string) => {
    return Array.isArray(selectedModels) && selectedModels.includes(modelId)
  }

  return {
    pinnedModels: selectedModels,
    isModelPinned,
    toggleModel,
    pinModel,
    unpinModel,
    selectRecommendedModels,
    unselectAllModels,
  }
}
