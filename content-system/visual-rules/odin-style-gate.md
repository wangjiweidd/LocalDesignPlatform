# Odin Style Gate

Use this gate before adapting reference videos, external templates, or Yaoning patterns into the Odin video pipeline.

## Hard Reject

Reject the reference if any item is true:

- looks like a generic SaaS dashboard demo
- relies on cute characters, playful stickers, or child-oriented bounce
- uses dark cyber/neon/game aesthetics
- uses cinematic camera moves that distract from the argument
- turns the video into a slide deck with too much text
- requires text baked into image assets
- uses decorative motion that does not clarify the claim, sequence, or comparison
- has unclear commercial usage rights

## Fit Score

Score 0-2 for each item. Promote only if total is 8+ and no hard reject is hit.

| Criterion | 0 | 1 | 2 |
|-----------|---|---|---|
| Audience fit | child/consumer tone | neutral | adult knowledge-worker tone |
| Argument clarity | decorative | partly supports point | sharpens the point |
| Information density | too thin or too crowded | acceptable | dense but readable |
| Motion discipline | distracting | acceptable | reinforces timing/emphasis |
| Reuse potential | one-off | reusable with edits | reusable across topics |

## Odin Visual Norms

Core style:

- dark editorial background or quiet light analytical layout
- orange accent as primary emphasis
- blue/indigo/green only when the content type requires it
- large claim, number, or contrast as the visual anchor
- captions stay readable and secondary to the main claim
- text remains editable in React
- no character-led storytelling by default
- motion should explain hierarchy, contrast, sequence, or evidence

## Preferred Patterns

Prioritize:

- thesis card
- data slam
- comparison split
- method steps
- checklist reveal
- timeline milestone
- concept definition card

Avoid:

- mascot intros
- reward/celebration confetti
- playful badges
- overloaded UI mockups
- decorative particles with no information role

## Promotion Path

```text
reference
-> classify content type
-> score with Odin gate
-> test inside existing scene
-> repeat in second topic
-> formalize in catalog
```

Formal catalog targets:

- scene contracts: `content-system/visual-rules/scenes.md`
- motion presets: `content-system/visual-rules/motion-presets.md`
- animation feel: `content-system/visual-rules/animation-styles.md`
- color/type rules: `content-system/visual-rules/color-palettes.md` and `typography.md`
- track rules: `content-system/tracks/knowledge-sharing.md`
