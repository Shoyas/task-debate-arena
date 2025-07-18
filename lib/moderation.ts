const BANNED_WORDS = [
  "stupid",
  "idiot",
  "dumb",
  "moron",
  "fool",
  "loser",
  "pathetic",
  "worthless",
  "useless",
  "garbage",
  "trash",
  "scum",
  "disgusting",
  "hate",
  "kill",
  "die",
  "murder",
  "violence",
  "terrorist",
  "nazi",
  "racist",
  "sexist",
  "homophobic",
  "transphobic",
  "bigot",
]

export function containsToxicContent(text: string): boolean {
  const lowerText = text.toLowerCase()
  return BANNED_WORDS.some((word) => lowerText.includes(word))
}

export function getToxicWords(text: string): string[] {
  const lowerText = text.toLowerCase()
  return BANNED_WORDS.filter((word) => lowerText.includes(word))
}

export function checkToxicContent(text: string): { isToxic: boolean; toxicWords: string[] } {
  const lowerText = text.toLowerCase()
  const foundToxicWords = BANNED_WORDS.filter((word) => lowerText.includes(word))
  return {
    isToxic: foundToxicWords.length > 0,
    toxicWords: foundToxicWords,
  }
}