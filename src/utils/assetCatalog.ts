// Maps catalog IDs (from content-system/asset-library/catalog.md) to local Lottie JSON.
// Add entries here after downloading assets to public/assets/lottie/.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LottieData = Record<string, any>;

// Populated in Task 6 — import each downloaded JSON here.
export const LOTTIE_CATALOG: Record<string, LottieData> = {
  // 'fx-confetti-warm': confettiWarm,  ← uncomment after downloading
};

export const CHARACTER_CATALOG: Record<string, string> = {
  // 'char-png-child-curious': '/assets/characters/yaoning/child-curious.png',
};

export function getLottie(id: string): LottieData | null {
  return LOTTIE_CATALOG[id] ?? null;
}
