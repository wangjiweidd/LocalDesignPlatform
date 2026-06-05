# Remotion Reference Library

This file records Remotion resources that are likely useful for Local Design Platform video generation.
It is a reference library, not a schema source. The production rules remain in
`templates/remotion-video/content-system/`.

## Usage Rules

- Check this file when designing a new Remotion scene, motion pattern, chart, title treatment, or renderer feature.
- Prefer Remotion-native frame animation, `interpolate`, `spring`, `Sequence`, local timeline helpers, SVG, CSS transforms, and Lottie assets before adding a new dependency.
- Do not copy external prompt output directly into production. Translate the pattern into local scene IDs, motion presets, and renderer components.
- Do not introduce Three.js, Skia, GSAP, Anime.js, Rive, Spline, or other runtime dependencies unless the feature clearly needs them and rendering has been verified.
- The content-system schema is authoritative. Do not invent fields or scene IDs from these links.

## Current Project Fit

### Already Useful Now

- Remotion core primitives
  - Source: https://www.remotion.dev/docs/resources
  - Use for: `Composition`, `Sequence`, `AbsoluteFill`, `Audio`, `Img`, `staticFile`, `useCurrentFrame`, `interpolate`, `spring`.
  - Local status: already in active use.

- Google Fonts and local fonts
  - Source: https://www.remotion.dev/docs/resources
  - Use for: controlled Chinese/English typography and cover consistency.
  - Local status: already in active use through `@remotion/google-fonts` and `@remotion/fonts`.

- Lottie
  - Source: https://www.remotion.dev/docs/resources
  - Use for: lightweight decorative effects, celebration bursts, icon motion, confetti, checkmarks.
  - Local status: already in active use through `@remotion/lottie`.

- Light-leak transition
  - Source: https://www.remotion.dev/docs/resources
  - Use for: occasional warm transitions, not as a default visual layer.
  - Local status: package installed; use only if it improves a specific scene transition.

- Remotion transitions
  - Source: https://www.remotion.dev/docs/resources
  - Use for: shot-to-shot transitions when hard cuts feel too abrupt.
  - Local status: package installed; not yet standardized in the V12 education visual language.

### Useful Later, Add Only With A Concrete Need

- React Three Fiber / Three.js
  - Source: https://www.remotion.dev/docs/resources
  - Use for: true 3D scenes, orbiting product visuals, spatial explainers.
  - Cost: heavier rendering and more layout risk. Avoid for normal 2D short-video scenes.

- Skia
  - Source: https://www.remotion.dev/docs/resources
  - Use for: advanced canvas-like graphics, procedural texture, custom drawing effects.
  - Cost: extra rendering surface and dependency complexity.

- Rive
  - Source: https://www.remotion.dev/docs/resources
  - Use for: reusable character/state-machine animations.
  - Cost: requires asset pipeline discipline and preview verification.

- Spline
  - Source: https://www.remotion.dev/docs/resources
  - Use for: imported 3D scenes when the design is already built in Spline.
  - Cost: external asset workflow; do not make it a default renderer dependency.

- GSAP / Anime.js examples
  - Source: https://www.remotion.dev/docs/resources
  - Use for: studying sequencing patterns only.
  - Local decision: keep Remotion-native deterministic frame animation unless a concrete scene proves GSAP/Anime.js is necessary.

- Anime.js
  - Source: https://github.com/juliangarnier/anime
  - Docs: https://animejs.com/documentation
  - Use for: complex SVG path motion, shape morphing, staggered text/element choreography, and studying compact timeline APIs.
  - Local decision: reference only for now. Do not add `animejs` as a renderer dependency unless a specific scene needs its SVG helpers or morphing features and the Remotion seek bridge has been verified.
  - Remotion integration note: Anime.js can be driven by Remotion frames by creating animations with autoplay disabled and seeking to `frame / fps * 1000`, but this adds lifecycle complexity compared with local frame-based helpers.

- Mapbox / MapLibre examples
  - Source: https://www.remotion.dev/docs/resources
  - Use for: location explainers, route stories, city-data visuals.
  - Cost: map tiles and API keys can make rendering less deterministic.

- Matter.js / physics examples
  - Source: https://www.remotion.dev/docs/resources
  - Use for: physics-based explainers or playful game-like visuals.
  - Cost: only acceptable when the physical simulation is the core of the scene.

## Prompt References From User

### News Article Headline Highlight

- Source: https://www.remotion.dev/prompts/news-article-headline-highlight
- Pattern: editorial headline composition with emphasis on selected words or phrases.
- Best fit:
  - knowledge-sharing hooks
  - article-to-video intros
  - quote/title cards
  - caption keyword emphasis
- Local implementation direction:
  - Build with local typography tokens, `splitKeyword`, and frame-based highlight reveal.
  - Useful as a reference for `quote-hero`, `concept-card`, and future news-style scenes.

### Rocket Launches Timeline

- Source: https://www.remotion.dev/prompts/rocket-launches-timeline
- Pattern: chronological timeline with milestones and motion along a path.
- Best fit:
  - process explainers
  - learning milestones
  - project progress
  - education growth stages
- Local implementation direction:
  - Reuse local timeline helper and SVG path progress.
  - Useful for improving `timeline-flow` and education stage progression scenes.

### Bar + Line Chart Combined

- Source: https://www.remotion.dev/prompts/bar-line-chart-combined
- Pattern: combined bar and line chart for dual-metric storytelling.
- Best fit:
  - data-heavy knowledge videos
  - before/after comparisons
  - growth and conversion explainers
- Local implementation direction:
  - Implement as SVG, not charting-library first.
  - Map values through a strict data schema before rendering.

### Music CD Store Promo

- Source: https://www.remotion.dev/prompts/music-cd-store-promo
- Pattern: product-promo scene with rhythm, cover-art focus, and retail-style layout.
- Best fit:
  - template-library promo videos
  - product cards
  - asset showcase scenes
- Local implementation direction:
  - Use as layout inspiration only. Keep Local Design Platform visual language cleaner and less retail-heavy unless the project is explicitly promotional.

### Shape To Words Transformation

- Source: https://www.remotion.dev/prompts/shape-to-words-transformation
- Pattern: abstract shape morphing into readable words.
- Best fit:
  - title openers
  - keyword reveals
  - conceptual transitions
- Local implementation direction:
  - Use SVG masks, clip paths, opacity, and transform sequences before adding a morphing library.
  - Good candidate for a reusable keyword-reveal component.

### BMS Active Cell Balancing Animation

- Source: https://www.remotion.dev/prompts/bms-active-cell-balancing-animation-8s1p-pack-with-energy-flow-visualization
- Pattern: technical system visualization with energy flow, cells, and state changes.
- Best fit:
  - engineering explainers
  - system diagrams
  - process and flow visualization
- Local implementation direction:
  - Treat as a reference for technical diagrams and animated flow arrows.
  - Build with SVG primitives and deterministic frame progress.

### The Kinetic Marketing

- Source: https://www.remotion.dev/prompts/the-kinetic-marketing
- Pattern: fast kinetic typography and marketing-style motion.
- Best fit:
  - high-energy intros
  - campaign launch videos
  - text-led promotional segments
- Local implementation direction:
  - Use sparingly. Good for hook intensity, but avoid overusing it in calm education videos.
  - Translate into local timing presets rather than adding external animation libraries by default.

## Shortlist To Consider Next

1. Standardize a `KeywordReveal` component inspired by headline highlight and shape-to-words transformation.
2. Add a `MetricComboChart` scene inspired by the combined bar-line chart prompt.
3. Add a `FlowDiagram` scene for technical/process videos, borrowing from the BMS energy-flow reference.
4. Decide whether `@remotion/transitions` and `@remotion/light-leaks` should be actively used or removed from dependencies.
