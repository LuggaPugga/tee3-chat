import { Plus, X } from "lucide-react"
import { db } from "@/utils/instant"
import { useState, useEffect } from "react"
import { Switch } from "../ui/switch"
import { useTheme } from "../theme-provider"
import { useSettings } from "../settings-provider"
import { toast } from "sonner"

export default function Customization() {
  const [name, setName] = useState("")
  const [occupation, setOccupation] = useState("")
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [traitInput, setTraitInput] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")

  const auth = db.useAuth()
  const { theme, setTheme } = useTheme()
  const {
    disableThematicBreaks,
    setDisableThematicBreaks,
    hidePersonalInfo,
    setHidePersonalInfo,
    statsForNerds,
    setStatsForNerds,
  } = useSettings()

  const preferences = db.useQuery({
    preferences: {
      $: {
        limit: 1,
        where: auth.user?.id ? { user: auth.user.id } : undefined,
      },
    },
  })

  // Initialize form data from existing preferences
  useEffect(() => {
    if (preferences?.data?.preferences?.[0]) {
      const pref = preferences.data.preferences[0]
      setName(pref.name || "")
      setOccupation(pref.what_do_you_do || "")
      setAdditionalInfo(pref.knowledge || "")
      if (pref.traits) {
        // Handle both array (new format) and string (legacy format)
        if (Array.isArray(pref.traits)) {
          setSelectedTraits(pref.traits)
        } else if (typeof pref.traits === "string") {
          const traitsArray = pref.traits.split(", ").filter((trait: string) => trait.trim() !== "")
          setSelectedTraits(traitsArray)
        }
      }
    }
  }, [preferences?.data?.preferences])

  const addTrait = (trait: string) => {
    const trimmedTrait = trait.trim()
    if (trimmedTrait && !selectedTraits.includes(trimmedTrait) && selectedTraits.length < 50) {
      setSelectedTraits([...selectedTraits, trimmedTrait])
      setTraitInput("")
    }
  }

  const removeTrait = (trait: string) => {
    setSelectedTraits(selectedTraits.filter((t) => t !== trait))
  }

  const handleTraitInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      addTrait(traitInput)
    }
  }

  const submitPreferences = () => {
    db.transact(
      db.tx.preferences[auth.user?.id ?? ""]
        .update({
          name: name,
          what_do_you_do: occupation,
          knowledge: additionalInfo,
        })
        .merge({
          traits: selectedTraits,
        })
        .link({
          user: auth.user?.id,
        })
    ).then(() => {
      toast.success("Preferences saved!")
    })
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Customization T3 Chat</h2>
      <form className="grid gap-6 ">
        <div className="relative grid gap-2">
          <label className="text-base font-medium">What should T3 Chat call you?</label>
          <input
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            placeholder="Enter your name"
            aria-invalid="false"
            maxLength={50}
            defaultValue={preferences?.data?.preferences[0]?.name}
            onChange={(e) => setName(e.target.value)}
            name="name"
          />
          <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
            {name.length}/50
          </span>
        </div>
        <div className="relative grid gap-2">
          <label className="text-base font-medium">What do you do?</label>
          <input
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            placeholder="Engineer, student, etc."
            aria-invalid="false"
            maxLength={100}
            defaultValue={preferences?.data?.preferences[0]?.what_do_you_do}
            onChange={(e) => setOccupation(e.target.value)}
            name="occupation"
          />
          <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
            {occupation.length}/100
          </span>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <label className="text-base font-medium">
              What traits should T3 Chat have?
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (up to 50, max 100 chars each)
              </span>
            </label>
          </div>
          <div className="relative">
            <div className="h-full flex-col text-popover-foreground relative flex w-full overflow-visible rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
              {selectedTraits.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {selectedTraits.map((trait) => (
                    <div
                      key={trait}
                      className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 !pr-1.5 has-[button:hover]:bg-destructive has-[button:hover]:text-destructive-foreground"
                    >
                      <span className="text-sm">{trait}</span>
                      <button
                        type="button"
                        className="ml-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        onClick={() => removeTrait(trait)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center">
                <input
                  className="flex w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Type a trait and press Enter or Tab..."
                  maxLength={100}
                  type="text"
                  value={traitInput}
                  onChange={(e) => setTraitInput(e.target.value)}
                  onKeyDown={handleTraitInputKeyDown}
                />
              </div>
              <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
                {selectedTraits.length}/50
              </span>
            </div>
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {["friendly", "witty", "concise", "curious", "empathetic", "creative", "patient"]
              .filter((suggestedTrait) => !selectedTraits.includes(suggestedTrait))
              .map((suggestedTrait) => (
                <div
                  key={suggestedTrait}
                  className="rounded-md border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 flex select-none items-center gap-1 text-xs font-medium cursor-pointer"
                  onClick={() => addTrait(suggestedTrait)}
                >
                  {suggestedTrait}
                  <Plus className="h-4 w-4" />
                </div>
              ))}
          </div>
        </div>
        <div className="relative grid gap-2">
          <div className="flex items-center gap-2">
            <label className="text-base font-medium">
              Anything else T3 Chat should know about you?
            </label>
          </div>
          <textarea
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[100px]"
            name="additionalInfo"
            placeholder="Interests, values, or preferences to keep in mind"
            aria-invalid="false"
            maxLength={3000}
            defaultValue={preferences?.data?.preferences[0]?.knowledge}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
          <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
            {additionalInfo.length}/3000
          </span>
        </div>
        <div className="flex flex-row items-center gap-2 justify-between">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-input/60 disabled:hover:bg-background h-9 px-4 py-2"
            type="button"
          >
            Load Legacy Data
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 px-4 py-2"
            type="button"
            onClick={submitPreferences}
          >
            Save Preferences
          </button>
        </div>
      </form>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Visual Options</h2>
        <div className="space-y-6 py-2">
          <div className="flex items-center justify-between gap-x-1">
            <div className="space-y-0.5">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">
                Boring Theme
              </label>
              <p className="text-sm text-muted-foreground">
                If you think the pink is too much, turn this on to tone it down.
              </p>
            </div>
            <Switch
              checked={theme === "boring-dark" || theme === "boring-light"}
              onCheckedChange={() => {
                if (theme === "dark") {
                  setTheme("boring-dark")
                } else if (theme === "light") {
                  setTheme("boring-light")
                } else if (theme === "boring-dark") {
                  setTheme("dark")
                } else if (theme === "boring-light") {
                  setTheme("light")
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-x-1">
            <div className="space-y-0.5">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">
                Hide Personal Information
              </label>
              <p className="text-sm text-muted-foreground">
                Hides your name and email from the UI.
              </p>
            </div>
            <Switch checked={hidePersonalInfo} onCheckedChange={setHidePersonalInfo} />
          </div>
          <div className="flex items-center justify-between gap-x-1">
            <div className="space-y-0.5">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">
                Disable Thematic Breaks
              </label>
              <p className="text-sm text-muted-foreground">
                Hides horizontal lines in chat messages. (Some browsers have trouble rendering
                these, turn off if you have bugs with duplicated lines)
              </p>
            </div>
            <Switch checked={disableThematicBreaks} onCheckedChange={setDisableThematicBreaks} />
          </div>
          <div className="flex items-center justify-between gap-x-1">
            <div className="space-y-0.5">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">
                Stats for Nerds
              </label>
              <p className="text-sm text-muted-foreground">
                Enables more insights into message stats including tokens per second, time to first
                token, and estimated tokens in the message.
              </p>
            </div>
            <Switch disabled checked={statsForNerds} onCheckedChange={setStatsForNerds} />
          </div>
        </div>
      </div>
    </div>
  )
}
