# Color Palettes

Track-specific color systems. All values are hex. Use exactly as specified — do not approximate.

---

## Knowledge Sharing Palette

### Dark Scheme (default for data, quote, concept, timeline)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `ks-bg-dark` | `#0F172A` | Full-bleed background |
| Surface | `ks-surface-dark` | `#1E293B` | Cards, panels |
| Text primary | `ks-text-primary-dark` | `#F1F5F9` | Main text |
| Text secondary | `ks-text-secondary-dark` | `#94A3B8` | Captions, labels |
| Accent amber | `ks-accent-amber` | `#F59E0B` | Data values, highlights |
| Accent blue | `ks-accent-blue` | `#3B82F6` | Steps, progress |
| Accent indigo | `ks-accent-indigo` | `#6366F1` | Concept terms |
| Accent pink | `ks-accent-pink` | `#EC4899` | Quotes, opinions |
| Success | `ks-success` | `#10B981` | Checklist, positive comparison |
| Border | `ks-border-dark` | `#334155` | Dividers, panel edges |

### Light Scheme (for step-breakdown, checklist)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `ks-bg-light` | `#F8FAFC` | Full-bleed background |
| Surface | `ks-surface-light` | `#FFFFFF` | Cards |
| Text primary | `ks-text-primary-light` | `#0F172A` | Main text |
| Text secondary | `ks-text-secondary-light` | `#64748B` | Captions |
| Accent blue | `ks-accent-blue` | `#3B82F6` | Step numbers, CTA |
| Success | `ks-success` | `#10B981` | Completed checks |
| Border | `ks-border-light` | `#E2E8F0` | Dividers |

### Accent by Content Type

| Content Type | `accentColor` |
|---|---|
| data-insight | `#F59E0B` |
| step-breakdown | `#3B82F6` |
| concept-explain | `#6366F1` |
| quote-insight | `#EC4899` |
| comparison | `#10B981` |
| checklist | `#10B981` |
| timeline | `#F59E0B` |

---

## AI Education Palette

### Warm Scheme (default — ai-concept, family-challenge, story, achievement, qa)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background warm | `ed-bg-warm` | `#FFF7ED` | Default background |
| Background warm deep | `ed-bg-warm-deep` | `#FFEDD5` | Gradient endpoint |
| Surface | `ed-surface` | `#FFFFFF` | Cards, bubbles |
| Text primary | `ed-text-primary` | `#1C1917` | Main text |
| Text secondary | `ed-text-secondary` | `#78716C` | Captions |
| Character orange | `ed-char-orange` | `#F97316` | Character accent, default |
| Play violet | `ed-play-violet` | `#8B5CF6` | Challenges, games |
| Play yellow | `ed-play-yellow` | `#FBBF24` | Stars, rewards |
| Celebrate emerald | `ed-celebrate` | `#10B981` | Achievement, win |
| Question indigo | `ed-question` | `#6366F1` | Q&A question state |
| Border | `ed-border` | `#FED7AA` | Warm dividers |

### Safety Scheme (boundary-card scene only)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `ed-safety-bg` | `#1C1917` | Dark, serious |
| Text | `ed-safety-text` | `#FEF3C7` | Warm white |
| Accent | `ed-safety-accent` | `#F59E0B` | Pulse border, warning icon |
| Never use | — | `#EF4444` | RED IS FORBIDDEN in safety shots |

### Cool Scheme (usage-demo scene)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `ed-bg-cool` | `#EFF6FF` | Device/demo background |
| Accent | `ed-demo-blue` | `#3B82F6` | Annotation arrows, step numbers |
| Screen bg | `ed-screen` | `#F0F9FF` | Device screen fill |

### Accent by Content Type

| Content Type | `accentColor` | `colorScheme` |
|---|---|---|
| ai-concept | `#F97316` | `light` |
| family-challenge | `#8B5CF6` | `light` |
| story-scene | `#F97316` | `light` |
| usage-demo | `#3B82F6` | `light` |
| safety-rule | `#F59E0B` | `dark` |
| achievement | `#10B981` | `light` |
| qa-reveal | `#6366F1` | `light` |

---

## Usage Rules

1. Within a track, do not mix warm and cool palettes in the same video unless scene type explicitly changes.
2. The `accentColor` in JSON drives: keyword highlights, step numbers, data values, progress indicators.
3. Background color is determined by `colorScheme` + `accentColor` combination — the renderer picks from this table.
4. Do not use pure black (`#000000`) or pure white (`#FFFFFF`) as backgrounds — use the tokens above.
