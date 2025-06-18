"use client"

import * as React from "react"

export interface UseSettingsProps {
  /** Whether thematic breaks (hr elements) are disabled in markdown */
  disableThematicBreaks: boolean
  /** Update the disableThematicBreaks setting */
  setDisableThematicBreaks: (disabled: boolean) => void
  /** Whether personal information (name, email) is hidden from UI */
  hidePersonalInfo: boolean
  /** Update the hidePersonalInfo setting */
  setHidePersonalInfo: (hidden: boolean) => void
  /** Whether stats for nerds are enabled */
  statsForNerds: boolean
  /** Update the statsForNerds setting */
  setStatsForNerds: (enabled: boolean) => void
}

const SettingsContext = React.createContext<UseSettingsProps | undefined>(undefined)

const defaultContext: UseSettingsProps = {
  disableThematicBreaks: false,
  setDisableThematicBreaks: () => {},
  hidePersonalInfo: false,
  setHidePersonalInfo: () => {},
  statsForNerds: false,
  setStatsForNerds: () => {},
}

export const useSettings = () => React.useContext(SettingsContext) ?? defaultContext

export interface SettingsProviderProps extends React.PropsWithChildren {
  /** Key used to store settings in localStorage */
  storageKey?: string
}

export const SettingsProvider = ({
  children,
  storageKey = "ui-settings",
}: SettingsProviderProps): React.ReactNode => {
  const context = React.useContext(SettingsContext)

  // Ignore nested context providers, just passthrough children
  if (context) return children
  return <Settings storageKey={storageKey}>{children}</Settings>
}

const Settings = ({
  children,
  storageKey = "ui-settings",
}: SettingsProviderProps & { storageKey: string }) => {
  const [disableThematicBreaks, setDisableThematicBreaksState] = React.useState(() => {
    if (typeof window === "undefined") return false

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const settings = JSON.parse(saved)
        return settings.disableThematicBreaks ?? false
      }
    } catch (e) {
      // Ignore errors
    }
    return false
  })

  const [hidePersonalInfo, setHidePersonalInfoState] = React.useState(() => {
    if (typeof window === "undefined") return false

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const settings = JSON.parse(saved)
        return settings.hidePersonalInfo ?? false
      }
    } catch (e) {
      // Ignore errors
    }
    return false
  })

  const [statsForNerds, setStatsForNerdsState] = React.useState(() => {
    if (typeof window === "undefined") return false

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const settings = JSON.parse(saved)
        return settings.statsForNerds ?? false
      }
    } catch (e) {
      // Ignore errors
    }
    return false
  })

  const setDisableThematicBreaks = React.useCallback(
    (disabled: boolean) => {
      setDisableThematicBreaksState(disabled)

      try {
        const currentSettings = localStorage.getItem(storageKey)
        const settings = currentSettings ? JSON.parse(currentSettings) : {}
        settings.disableThematicBreaks = disabled
        localStorage.setItem(storageKey, JSON.stringify(settings))
      } catch (e) {
        // Ignore errors
      }
    },
    [storageKey]
  )

  const setHidePersonalInfo = React.useCallback(
    (hidden: boolean) => {
      setHidePersonalInfoState(hidden)

      try {
        const currentSettings = localStorage.getItem(storageKey)
        const settings = currentSettings ? JSON.parse(currentSettings) : {}
        settings.hidePersonalInfo = hidden
        localStorage.setItem(storageKey, JSON.stringify(settings))
      } catch (e) {
        // Ignore errors
      }
    },
    [storageKey]
  )

  const setStatsForNerds = React.useCallback(
    (enabled: boolean) => {
      setStatsForNerdsState(enabled)

      try {
        const currentSettings = localStorage.getItem(storageKey)
        const settings = currentSettings ? JSON.parse(currentSettings) : {}
        settings.statsForNerds = enabled
        localStorage.setItem(storageKey, JSON.stringify(settings))
      } catch (e) {
        // Ignore errors
      }
    },
    [storageKey]
  )

  // localStorage event handling to sync settings between tabs
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return

      try {
        const settings = e.newValue ? JSON.parse(e.newValue) : {}
        setDisableThematicBreaksState(settings.disableThematicBreaks ?? false)
        setHidePersonalInfoState(settings.hidePersonalInfo ?? false)
        setStatsForNerdsState(settings.statsForNerds ?? false)
      } catch (e) {
        // Ignore errors
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [storageKey])

  const providerValue = React.useMemo(
    () => ({
      disableThematicBreaks,
      setDisableThematicBreaks,
      hidePersonalInfo,
      setHidePersonalInfo,
      statsForNerds,
      setStatsForNerds,
    }),
    [
      disableThematicBreaks,
      setDisableThematicBreaks,
      hidePersonalInfo,
      setHidePersonalInfo,
      statsForNerds,
      setStatsForNerds,
    ]
  )

  return <SettingsContext.Provider value={providerValue}>{children}</SettingsContext.Provider>
}
