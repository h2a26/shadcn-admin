export function getAvatarName(username?: string | null): string {
  if (!username) return '??'

  const normalized = username
    .trim()
    .replace(/[^\p{L}\s]/gu, '') // Keep only letters and whitespace

  if (!normalized) return '??'

  const parts = normalized.split(/\s+/).filter(Boolean)
  const getInitial = (word: string): string => word.charAt(0).toUpperCase()

  if (parts.length >= 2) {
    return getInitial(parts[0]) + getInitial(parts[1])
  }

  const fallback = parts[0].substring(0, 2).toUpperCase()
  return fallback.padEnd(2, '?')
}
