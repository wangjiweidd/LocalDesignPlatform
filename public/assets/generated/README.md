# Generated Visual Assets

This folder stores reusable bitmap assets for the Remotion branch video pipeline.

Generated final video outputs stay in `public/output/` and are ignored by Git. Assets in this folder are part of the reusable source library and can be committed when the visual direction is approved.

## doudou-robot.png

- Mode: built-in Image generation, then local chroma-key removal.
- Source: `tmp/imagegen/doudou-robot-source.png`
- Output: `public/assets/generated/doudou-robot.png`
- Format: transparent PNG, RGBA.
- Intended use: reusable mascot asset for cover and in-video scenes.

Prompt summary:

```text
Create one polished mascot robot character named Doudou for a Chinese parent-child AI education video brand.
Cute friendly AI robot, rounded white circular head, black glossy face screen, cyan glowing eyes and smile, golden star antenna, cream body, golden shield badge with AI on the chest.
Premium 2D/3D hybrid vector-like illustration, clean edges, warm friendly, suitable for Chinese Xiaohongshu educational videos.
Use a perfectly flat #00ff00 chroma-key background for background removal.
```

## Asset Set

- `membership-card.png`: reusable payment/member card prop. Text and prices are rendered in Remotion, not baked into the image.
- `rules-board.png`: reusable checklist board prop. Rule text is rendered in Remotion.
- `purpose-target.png`: reusable target/bullseye prop for "purpose" scenes.
- `magnifier.png`: reusable verification/source-check prop.

Shared generation rule:

```text
Use a premium warm 2D/3D hybrid vector-like illustration style, no readable text, and a perfectly flat #00ff00 chroma-key background for local alpha removal.
```
