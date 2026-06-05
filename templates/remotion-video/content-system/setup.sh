#!/usr/bin/env bash
set -e

CONTENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOLD='\033[1m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; DIM='\033[2m'; RESET='\033[0m'

echo ""
echo -e "${BOLD}Remotion Content System — Setup${RESET}"
echo -e "${DIM}Content system path: $CONTENT_DIR${RESET}"
echo ""

# ── Claude Code ────────────────────────────────────────────────────────────────

setup_claude() {
  local skill_dir="$HOME/.claude/skills/remotion-content-system"
  mkdir -p "$skill_dir"

  cat > "$skill_dir/index.md" << EOF
---
name: remotion-content-system
description: Generate Remotion video script JSON for two tracks — 知识干货分享 and 亲子AI教育. Use when the user asks to make a video, generate a video script, or mentions a content topic for either track.
type: project
---

# Remotion Content System

Generates a complete \`ScriptData\` JSON for Remotion rendering from raw content input.

## When to trigger

- User provides a topic, title, or key points for a video
- User says "帮我生成视频脚本" or "make a video about X"
- Content belongs to 知识干货分享 or 亲子AI教育

## How to use

Read these files in order:

1. \`$CONTENT_DIR/system-prompt.md\` — follow as generation instructions
2. \`$CONTENT_DIR/tracks/knowledge-sharing.md\` OR \`$CONTENT_DIR/tracks/ai-education.md\`
3. \`$CONTENT_DIR/visual-rules/schemas.md\` — for exact JSON structure

Reference as needed:
- \`$CONTENT_DIR/visual-rules/scenes.md\`
- \`$CONTENT_DIR/visual-rules/motion-presets.md\`
- \`$CONTENT_DIR/visual-rules/animation-styles.md\`
- \`$CONTENT_DIR/visual-rules/color-palettes.md\`
- \`$CONTENT_DIR/visual-rules/typography.md\`

## Examples

- \`$CONTENT_DIR/examples/knowledge-example.json\`
- \`$CONTENT_DIR/examples/education-example.json\`
EOF

  echo -e "  ${GREEN}✔${RESET} Claude Code  →  $skill_dir/index.md"
}

# ── Codex ──────────────────────────────────────────────────────────────────────

setup_codex() {
  local skill_dir="$HOME/.codex/skills/remotion-content-system"
  mkdir -p "$skill_dir"

  cat > "$skill_dir/SKILL.md" << EOF
---
name: remotion-content-system
description: Generate Remotion video script JSON for two tracks — 知识干货分享 and 亲子AI教育. Use when the user asks to make a video, generate a video script, or mentions a content topic for either track.
---

# Remotion Content System

Generates a complete ScriptData JSON for Remotion rendering from raw content input.

## When to trigger

- User provides a topic, title, or key points for a video
- User says "帮我生成视频脚本" or "make a video about X"
- Content belongs to 知识干货分享 or 亲子AI教育

## How to use

Read these files in order:

1. \`$CONTENT_DIR/system-prompt.md\` — follow as generation instructions
2. \`$CONTENT_DIR/tracks/knowledge-sharing.md\` OR \`$CONTENT_DIR/tracks/ai-education.md\`
3. \`$CONTENT_DIR/visual-rules/schemas.md\` — for exact JSON structure

Reference as needed:
- \`$CONTENT_DIR/visual-rules/scenes.md\`
- \`$CONTENT_DIR/visual-rules/motion-presets.md\`
- \`$CONTENT_DIR/visual-rules/animation-styles.md\`
- \`$CONTENT_DIR/visual-rules/color-palettes.md\`
- \`$CONTENT_DIR/visual-rules/typography.md\`

## Examples

- \`$CONTENT_DIR/examples/knowledge-example.json\`
- \`$CONTENT_DIR/examples/education-example.json\`
EOF

  echo -e "  ${GREEN}✔${RESET} Codex        →  $skill_dir/SKILL.md"
}

# ── Run ────────────────────────────────────────────────────────────────────────

if command -v claude &>/dev/null || [ -d "$HOME/.claude" ]; then
  setup_claude
else
  echo -e "  ${YELLOW}–${RESET} Claude Code  not found, skipping"
fi

if command -v codex &>/dev/null || [ -d "$HOME/.codex" ]; then
  setup_codex
else
  echo -e "  ${YELLOW}–${RESET} Codex        not found, skipping"
fi

echo ""
echo -e "${BOLD}Done.${RESET} Both skills point to: ${DIM}$CONTENT_DIR${RESET}"
echo ""
