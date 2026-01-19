export function getVibeLabel(score) {
  if (score <= 3) return "Off Vibes";
  if (score <= 6) return "Mid Vibes";
  if (score <= 8) return "Good Vibes";
  return "Great Vibes";
}

export function getVibeDescription(score) {
  if (score <= 3) {
    return "Something feels inconsistent, low‑effort, or a little off. Mixed signals or red flags might be showing up.";
  }
  if (score <= 6) {
    return "Some interest, some hesitation. The energy is uneven, but not hopeless — this could go either way.";
  }
  if (score <= 8) {
    return "Solid green‑flag energy. They’re showing effort, matching your tone, and the vibe feels grounded.";
  }
  return "Strong, genuine vibes. Clear interest, emotional presence, and real potential for something good.";
}