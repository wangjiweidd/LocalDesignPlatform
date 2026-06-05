# Asset Catalog

Single source of truth for reusable assets. AI agents: check here before searching the web.
Add rows here after downloading/creating assets.

> **Note:** The 4 seed files below are functional placeholder animations.
> Replace with real LottieFiles downloads for production quality.
> Search [lottiefiles.com](https://lottiefiles.com) → Free → download JSON → save to the path below → import in `src/utils/assetCatalog.ts`

## Lottie — Effects

| ID | File | Tags | Source |
|----|------|------|--------|
| `fx-confetti-warm` | lottie/effects/confetti-warm.json | 庆祝, 撒花, 暖色 | placeholder (colored dots) |
| `fx-star-burst` | lottie/effects/star-burst.json | 星星, 爆炸, 奖励 | placeholder (star particles) |

## Lottie — Icons

| ID | File | Tags | Source |
|----|------|------|--------|
| `icon-check-draw` | lottie/icons/check-draw.json | 打勾, 清单, 完成 | placeholder (circle + checkmark) |
| `icon-question-wobble` | lottie/icons/question-wobble.json | 问号, 疑问 | placeholder (wobbling dot) |

## Lottie — Characters

| ID | File | Tags | Source |
|----|------|------|--------|
| _(empty — search LottieFiles for "clay child" or "cartoon family")_ | | | |

## Character PNG — 曜宁

| ID | File | Tags |
|----|------|------|
| _(empty — generate with Midjourney/DALL·E, save as transparent PNG)_ | | |

## How to add a new asset

1. Download Lottie JSON from lottiefiles.com → save to `public/assets/lottie/<category>/<id>.json`
2. Import in `src/utils/assetCatalog.ts` → add to `LOTTIE_CATALOG`
3. Add a row to this table with the ID, path, tags, and source URL
4. Use the catalog ID in any shot's `lottieId` field
