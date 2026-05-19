# External Motion Reference Sources

Use these sources as inspiration inputs only. Do not treat them as production dependencies.

## Source Catalog

| ID | Name | URL | Role | Best For | Risk |
|----|------|-----|------|----------|------|
| `remotion-showcase` | Remotion Showcase | https://www.remotion.dev/showcase | benchmark | programmatic video quality bar | case-only, not reusable code |
| `remotion-resources` | Remotion Resources | https://www.remotion.dev/docs/resources | implementation | libraries, examples, integrations | mixed quality |
| `remotion-templates` | Remotion Templates | https://www.remotion.dev/templates | implementation | native Remotion structure | may be too generic |
| `remotion-prompts` | Remotion Prompt Showcase | https://www.remotion.dev/prompts | pattern | scene ideas from prompts | prompt output needs filtering |
| `remotiontemplates-dev` | RemotionTemplates.dev | https://remotiontemplates.dev/ | implementation | paid/free template structure | licensing varies |
| `lottiefiles` | LottieFiles | https://lottiefiles.com/ | asset | icons, checkmarks, celebration, loaders | style mismatch, license check |
| `rive-marketplace` | Rive Marketplace | https://rive.app/marketplace | asset-reference | interactive character/state ideas | runtime complexity |
| `mobbin` | Mobbin | https://mobbin.com/ | pattern | mobile UI flows and product rhythm | app UI bias |
| `pageflows` | Pageflows | https://pageflows.com/ | pattern | real user flows and transitions | subscription, app UI bias |
| `keyframe-gallery` | Keyframe Gallery | https://www.keyframe.gallery/ | pattern | product motion references | not always video-native |
| `ripplix` | Ripplix | https://www.ripplix.com/ | pattern | micro-interactions | can become decorative |
| `kisto` | Kisto | https://kisto.app/inspiration/motion-design | style | motion design inspiration | broad style range |
| `motionographer` | Motionographer | https://motionographer.com/quickie/ | style | studio-grade motion quality | often too heavy |
| `stash` | Stash | https://www.stashmedia.tv/ | style | commercial motion and campaign language | often too advertising-like |
| `framer-gallery-animations` | Framer Gallery Animations | https://www.framer.com/gallery/styles/animations | style | web animation and layout rhythm | web-first, can overdo motion |
| `gsap-showcase` | GSAP Showcase | https://gsap.com/showcase/ | technique | timeline choreography ideas | technical complexity |

## Weekly Review Rule

Pick at most 3 external references per review. For each reference, extract only one reusable pattern:

```text
source -> observed pattern -> Yaoning fit score -> candidate type -> action
```

Candidate types:

- `scene-template`
- `visual-component`
- `motion-preset`
- `caption-pattern`
- `asset-style`
- `reject`

Do not copy visual style wholesale. Translate only the underlying structure or timing idea.
