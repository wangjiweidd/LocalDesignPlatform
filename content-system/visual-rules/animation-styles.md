# Animation Styles

Named spring and easing configurations. Referenced by the `animationStyle` field.  
These define the *feel* of an animation. Motion presets define *what* moves; animation styles define *how*.

All configs are for Remotion's `spring()` and `interpolate()` with `Easing`.

---

## Style Catalog

### `smooth-reveal`

**Feel:** Effortless, calm, professional. No bounce.  
**Use for:** Text fade-ins, background transitions, secondary elements  
**Track affinity:** Knowledge sharing (primary)

```ts
spring({ frame, fps, config: { damping: 200 } })
// Pair with opacity interpolation:
interpolate(progress, [0, 1], [0, 1], {
  easing: Easing.out(Easing.quad),
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
})
```

---

### `snappy-pop`

**Feel:** Quick, decisive, confident. Minimal bounce — settles fast.  
**Use for:** UI elements, step reveals, comparison panels, demo annotations  
**Track affinity:** Knowledge sharing (primary), AI education (secondary for demo/safety)

```ts
spring({ frame, fps, config: { damping: 20, stiffness: 200 } })
```

---

### `bouncy-enter`

**Feel:** Playful, energetic, child-friendly. Visible overshoot that settles warmly.  
**Use for:** Character entrances, challenge reveals, achievement moments, answer reveals  
**Track affinity:** AI education (primary)

```ts
spring({ frame, fps, config: { damping: 8 } })
```

---

### `dramatic-slam`

**Feel:** Heavy impact, then snap to rest. Commands attention.  
**Use for:** Statistics, quote hero text, milestone reveals  
**Track affinity:** Knowledge sharing data/quote types

```ts
spring({ frame, fps, config: { damping: 12, stiffness: 300 } })
// Scale usage:
const scale = interpolate(springProgress, [0, 1], [0.6, 1])
// Note: spring overshoots to ~1.06 before settling at 1.0 — this is intentional.
```

---

### `heavy-settle`

**Feel:** Slow, weighty, considered. Communicates importance without urgency.  
**Use for:** Key facts that need to sink in, final takeaway shots, safety rule frames  
**Track affinity:** Both tracks — use for highest-weight information

```ts
spring({ frame, fps, config: { mass: 2, damping: 15, stiffness: 80 } })
```

---

## Stagger Pattern

For list items or sequential reveals, offset the `frame` input per item:

```ts
// 6-frame stagger between items
const itemSpring = (itemIndex: number) =>
  spring({ frame: frame - itemIndex * 6, fps, config: { damping: 200 } })
```

Pair with `extrapolateLeft: 'clamp'` to prevent negative-frame artifacts.

---

## Entry + Exit Pattern

For elements that must enter and exit within a shot:

```ts
const { fps, durationInFrames } = useVideoConfig()

const enter = spring({ frame, fps, config: { damping: 200 } })
const exit = spring({
  frame,
  fps,
  config: { damping: 200 },
  delay: durationInFrames - Math.round(fps * 0.6), // exit 0.6s before shot ends
})

const opacity = enter - exit  // 0 → 1 → 0
```

---

## Style × Content Type Quick Reference

| Content Type | Recommended Style |
|---|---|
| data-insight | `dramatic-slam` |
| step-breakdown | `snappy-pop` |
| concept-explain | `smooth-reveal` |
| quote-insight | `dramatic-slam` |
| comparison | `snappy-pop` |
| checklist | `smooth-reveal` |
| timeline | `smooth-reveal` |
| ai-concept | `bouncy-enter` |
| family-challenge | `bouncy-enter` |
| story-scene | `smooth-reveal` |
| usage-demo | `snappy-pop` |
| safety-rule | `snappy-pop` |
| achievement | `bouncy-enter` |
| qa-reveal (question) | `bouncy-enter` |
| qa-reveal (answer) | `bouncy-enter` |
