# Remotion Motion Template

This folder contains renderer-side code for the video motion system.

The active Remotion renderer now lives inside this repository:

```text
renderers/remotion-video/src/motion/motionPresets.ts
```

Expected render flow:

1. The local design platform writes `source/render-data.json`.
2. Each shot contains `visualBeats`.
3. The renderer reads the shot's beats and applies `motionStyleForBeat(beat, localFrame)` to the matching visual target.
4. Existing renderers can keep using `frame/action`; newer renderers should use `preset/anchor/offsetFrames/durationFrames/intensity`.

The key production rule is simple: reusable presets live here, topic-specific data lives in `render-data.json`.
