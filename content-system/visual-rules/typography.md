# Typography

Font families, sizes, and weights per track. Load via `@remotion/google-fonts`.

---

## Knowledge Sharing Typography

### Font Stack

| Role | Font | Weight | Install |
|------|------|--------|---------|
| Primary (Chinese + Latin) | `Noto Sans SC` | 400, 700 | `@remotion/google-fonts/NotoSansSC` |
| Data / numbers | `Space Mono` | 400, 700 | `@remotion/google-fonts/SpaceMono` |
| Accent / hero quote | `Inter` | 700, 900 | `@remotion/google-fonts/Inter` |

### Size Scale (1080×1920 canvas)

| Element | Size | Weight | Font | Notes |
|---------|------|--------|------|-------|
| Hero stat / quote | 160–200px | 700 | `Space Mono` / `Inter` | `data-reveal`, `quote-hero` only |
| Shot title (`text`) | 72–88px | 700 | `Noto Sans SC` | |
| Keyword highlight | Same as title | 700 | Same | Color + underline differentiator |
| Caption (`caption`) | 44–52px | 400 | `Noto Sans SC` | Bottom card |
| Caption keyword | Same as caption | 700 | Same | Color differentiator |
| Step number | 96px | 700 | `Space Mono` | Accent color |
| Step label | 64px | 700 | `Noto Sans SC` | |
| Timeline year | 52px | 700 | `Space Mono` | Accent color |
| Timeline label | 40px | 400 | `Noto Sans SC` | |
| Cover title | 80–96px | 700 | `Noto Sans SC` | |
| Cover subtitle | 48px | 400 | `Noto Sans SC` | |

### Line Height & Spacing

- `text` field: `lineHeight: 1.3`, `letterSpacing: -0.02em`
- `caption` field: `lineHeight: 1.5`, `letterSpacing: 0`
- Number/stat: `lineHeight: 1.0` — tight, monolithic

---

## AI Education Typography

### Font Stack

| Role | Font | Weight | Install |
|------|------|--------|---------|
| Primary (Chinese) | `Noto Sans SC` | 400, 700 | `@remotion/google-fonts/NotoSansSC` |
| Playful / character name | `ZCOOL KuaiLe` | 400 | `@remotion/google-fonts/ZCOOLKuaiLe` |
| Numbers / scores | `Nunito` | 700, 800 | `@remotion/google-fonts/Nunito` |

**Note:** `ZCOOL KuaiLe` is Chinese-only. Use for character names, challenge titles, achievement headings — not for body text.

### Size Scale (1080×1920 canvas)

| Element | Size | Weight | Font | Notes |
|---------|------|--------|------|-------|
| Shot title (`text`) | 64–80px | 700 | `Noto Sans SC` | Slightly smaller — warmer feel |
| Keyword highlight | Same as title | 700 | Same | Color + rounded underline |
| Caption (`caption`) | 44–52px | 400 | `Noto Sans SC` | |
| Caption keyword | Same | 700 | Same | |
| Character name | 40px | 400 | `ZCOOL KuaiLe` | Warm, friendly |
| Challenge title | 72px | 400 | `ZCOOL KuaiLe` | Playful heading |
| Achievement text | 80px | 400 | `ZCOOL KuaiLe` | Celebration heading |
| Speech bubble | 52px | 700 | `Noto Sans SC` | Short, punchy lines only |
| Step number | 80px | 700 | `Nunito` | Rounded, friendly |
| Q&A question | 72–80px | 700 | `Noto Sans SC` | |
| Q&A answer | 64–72px | 700 | `Noto Sans SC` | |
| Cover title | 72–88px | 700 | `Noto Sans SC` | |

### Line Height & Spacing

- `text` field: `lineHeight: 1.4` — slightly looser for readability
- `caption` field: `lineHeight: 1.6` — generous for kids
- Speech bubble: `lineHeight: 1.3`, max 2 lines

---

## Loading Fonts in Remotion

```tsx
import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC";
import { loadFont as loadSpaceMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadZCOOLKuaiLe } from "@remotion/google-fonts/ZCOOLKuaiLe";

// Knowledge sharing
const { fontFamily: notoSansSC } = loadNotoSansSC("normal", {
  weights: ["400", "700"],
  subsets: ["chinese-simplified", "latin"],
});
const { fontFamily: spaceMono } = loadSpaceMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

// AI education
const { fontFamily: zcoolKuaiLe } = loadZCOOLKuaiLe("normal", {
  weights: ["400"],
  subsets: ["chinese-simplified"],
});
```

---

## Rules

1. Keep Chinese text in React components, never bake into images.
2. All `text` and `caption` fields must render in `Noto Sans SC` to ensure Chinese character coverage.
3. Decorative fonts (`ZCOOL KuaiLe`, `Space Mono`) are for display-only elements — headings, numbers, names.
4. Do not mix more than 2 font families in a single shot.
