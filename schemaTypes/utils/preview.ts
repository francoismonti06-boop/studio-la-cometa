export type LocalizedPreviewValue =
  | string
  | null
  | undefined
  | Record<string, unknown>

export function pickLocale(
  value: LocalizedPreviewValue,
  locale = "fr"
): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed || undefined
  }

  if (value && typeof value === "object") {
    const localized = value[locale]
    if (typeof localized === "string" && localized.trim()) {
      return localized.trim()
    }

    const fallbackFr = value.fr
    if (typeof fallbackFr === "string" && fallbackFr.trim()) {
      return fallbackFr.trim()
    }

    for (const item of Object.values(value)) {
      if (typeof item === "string" && item.trim()) {
        return item.trim()
      }
    }
  }

  return undefined
}