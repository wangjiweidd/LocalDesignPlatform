// Maps catalog IDs (from content-system/asset-library/catalog.md) to local Lottie JSON.
// Add entries here after downloading assets to public/assets/lottie/.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LottieData = Record<string, any>;

import confettiWarm   from '../../public/assets/lottie/effects/confetti-warm.json';
import starBurst      from '../../public/assets/lottie/effects/star-burst.json';
import checkDraw      from '../../public/assets/lottie/icons/check-draw.json';
import questionWobble from '../../public/assets/lottie/icons/question-wobble.json';

export const LOTTIE_CATALOG: Record<string, LottieData> = {
  'fx-confetti-warm':     confettiWarm,
  'fx-star-burst':        starBurst,
  'icon-check-draw':      checkDraw,
  'icon-question-wobble': questionWobble,
};

export const CHARACTER_CATALOG: Record<string, string> = {
  // 'char-png-child-curious': '/assets/characters/yaoning/child-curious.png',
};

export function getLottie(id: string): LottieData | null {
  return LOTTIE_CATALOG[id] ?? null;
}
