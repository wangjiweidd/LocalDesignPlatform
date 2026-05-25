# Odin Video Pipeline Prep

Scope: Odin knowledge-sharing vertical videos.

This document collects the existing materials that are useful for building the Odin video automation pipeline after the Yaoning pipeline has stabilized.

## Current Readiness

The codebase already has a first Odin-capable foundation:

- `track`: `knowledge-sharing`
- theme: `src/themes/theme-odin.ts`
- cover: `src/covers/OdinCover.tsx`
- composition router: `src/VideoComposition.tsx`
- shared caption: `src/components/ThemeCaption.tsx`
- data contract: `src/data/types-v2.ts`
- content rules: `content-system/tracks/knowledge-sharing.md`

The current Odin track is structurally ready, but less visually validated than Yaoning.

## Directly Useful From Existing Work

### Content Types

| Content Type | Best For | Default Scene |
|--------------|----------|---------------|
| `data-insight` | data, research, sharp metrics | `data-reveal` |
| `step-breakdown` | workflows, tutorials, methods | `step-list` |
| `concept-explain` | explaining terms or models | `concept-card` |
| `quote-insight` | strong opinions, screenshot-worthy lines | `quote-hero` |
| `comparison` | A vs B, before/after, tool comparisons | `comparison-split` |
| `checklist` | lists, mistakes, recommendations | `checklist-reveal` |
| `timeline` | evolution, roadmap, milestones | `timeline-flow` |

### Scene Components

All seven knowledge scenes already exist in code:

- `DataReveal`
- `StepList`
- `ConceptCard`
- `QuoteHero`
- `ComparisonSplit`
- `ChecklistReveal`
- `TimelineFlow`

First validation priority:

1. `quote-hero`
2. `data-reveal`
3. `step-list`
4. `comparison-split`
5. `checklist-reveal`
6. `concept-card`
7. `timeline-flow`

Reason: Odin likely needs strong claims, data, methods, comparisons, and compact lists before more complex chronology.

### Motion Presets

Keep these as Odin defaults:

- `dramatic-slam`: data and quote hero
- `snappy-pop`: steps and comparisons
- `smooth-reveal`: concepts, checklist, timeline
- `list-stagger`: sequential method or checklist
- `highlight-sweep`: keyword emphasis
- `split-slide`: comparison
- `dot-appear`: timeline

Do not reuse Yaoning's `bouncy-enter` as a default for Odin. It reads too playful.

## What Should Transfer From Yaoning

Transfer the process, not the visual style:

- script data drives rendering
- scene IDs are strict typed fields
- captions remain editable text
- reusable scene templates are promoted only after repeated use
- external references must pass a style gate
- `motion:review` remains the weekly review tool

Do not transfer:

- warm parent-child palette
- playful challenge language
- kid-friendly bounce
- character-first scenes
- decorative celebration assets as default language

## Odin Visual Direction

Odin should feel:

- credible
- dense but readable
- editorial
- analytical
- calm but decisive

Odin should not feel:

- cute
- SaaS dashboard-like
- cyber/neon
- overly cinematic
- like a generic course slide deck

## Recommended First Template Set

Before building new scene types, validate these five:

1. `quote-hero`: strong claim, opinion, or thesis.
2. `data-reveal`: one number plus implication.
3. `step-list`: method or workflow.
4. `comparison-split`: wrong way vs right way.
5. `checklist-reveal`: compact recommendations.

These cover most short-form knowledge video structures.

## External References Worth Reviewing First

Use these sources first for Odin:

- `remotion-prompts`: scene pattern ideas
- `remotion-templates`: Remotion-native implementation structure
- `keyframe-gallery`: product motion rhythm
- `mobbin`: mobile information hierarchy and flow pacing
- `pageflows`: real product transition pacing
- `stash`: only for editorial/commercial rhythm, not style copying

Lower priority:

- `lottiefiles`: only small icons/checks/arrows; avoid generic sticker feel
- `rive-marketplace`: reference only until there is a repeated interactive-character need
- `gsap-showcase`: technique reference only; do not add GSAP unless Remotion cannot express the motion

## Later Input From User

When the user provides reference videos or creative direction, classify each reference into this shape:

```text
reference -> content type -> reusable pattern -> Odin fit score -> implementation target
```

Implementation targets:

- update script prompt/rules
- tune an existing scene
- add a visual component
- add a motion preset
- create a new scene template
- reject

Default action should be tuning existing scenes before adding new scene types.

## First Automation Task Later

When Odin execution starts, create a quick preview composition like Yaoning's `QuickPreview`, but backed by a knowledge-sharing script:

```text
title: 一个成年人最该学会的 AI 能力
contentType: quote-insight or step-breakdown
duration: 5-8 seconds
scene: quote-hero or step-list
```

Use it to validate type, caption, spacing, and motion before generating full videos.
