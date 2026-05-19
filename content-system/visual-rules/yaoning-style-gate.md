# Yaoning Style Gate

Use this gate before promoting any external reference into the motion library.

## Hard Reject

Reject the reference if any item is true:

- looks like a SaaS landing page, dashboard, or app onboarding screen
- uses aggressive camera movement, strobing, glitch, or high-frequency cuts
- depends on dark cyber, neon, luxury, finance, or game UI aesthetics
- makes captions secondary to decoration
- requires text baked into image assets
- introduces a new runtime or asset format without a repeated need
- has unclear commercial usage rights

## Fit Score

Score 0-2 for each item. Promote only if total is 8+ and no hard reject is hit.

| Criterion | 0 | 1 | 2 |
|-----------|---|---|---|
| Audience fit | adult/product tone | neutral | parent education tone |
| Clarity | decorative | partly explanatory | improves comprehension |
| Motion weight | distracting | acceptable | subtle and readable |
| Reuse potential | one-off | reusable with edits | reusable across topics |
| Production cost | new pipeline | moderate | fits existing Remotion stack |

## Yaoning Visual Norms

Core style:

- warm cream background
- orange primary accent with small violet/green support
- centered information hierarchy
- stable top title or series header
- bottom caption remains readable and script-synced
- simple illustrative shapes, not dense UI
- no decorative robots unless the character has a clear story role
- motion should clarify timing, emphasis, or sequence

## Promotion Path

```text
external reference
-> pattern candidate
-> use in one project locally
-> reuse in a second project
-> add to formal catalog
```

Formal catalog targets:

- scene contracts: `content-system/visual-rules/scenes.md`
- motion presets: `content-system/visual-rules/motion-presets.md`
- animation feel: `content-system/visual-rules/animation-styles.md`
- color/type rules: `content-system/visual-rules/color-palettes.md` and `typography.md`
- assets: `content-system/asset-library/catalog.md`
