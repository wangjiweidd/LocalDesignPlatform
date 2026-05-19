# Track: 知识干货分享 (Knowledge Sharing)

Target audience: Adults — parents, professionals, curious learners on social platforms.  
Tone: Credible, clear, occasionally provocative. Always value-dense.  
Format: Short-form vertical video (1080×1920, 30fps).

---

## Content Types

### 1. 数据洞察 (data-insight)

**When to use:**  
Content centers on a statistic, research finding, or metric that surprises or validates.  
Examples: "78% of parents…", "ChatGPT用户增长了10倍", "平均每天刷2小时短视频"

**Shot structure:**
1. Hook shot — the raw stat, nothing else
2. Context shot — what the number means
3. Implication shot — so what do we do about it
4. (Optional) Comparison shot — vs. expectation or history
5. Takeaway shot — one action sentence

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `data-reveal` |
| `motionPreset` | `stat-slam` |
| `animationStyle` | `dramatic-slam` |
| `colorScheme` | `dark` |
| `accentColor` | `#F59E0B` |
| `shotDurationFrames` | `90` |

**Writing rules:**
- `text` on the hook shot should contain only the number + one noun (e.g., "78% 的家长担心屏幕时间")
- `keyword` = the number or the most alarming word
- Use `dataValue` field for the numeric string to enable counter animation

---

### 2. 步骤拆解 (step-breakdown)

**When to use:**  
Content is a process, how-to, or tutorial. Has a natural numbered order.  
Examples: "5步评估一个AI工具", "怎么教孩子问问题", "搭建知识库的流程"

**Shot structure:**
- 1 hook shot (why these steps matter)
- 1 shot per step (keep to 4–6 steps)
- 1 summary/action shot

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `step-list` |
| `motionPreset` | `list-stagger` |
| `animationStyle` | `snappy-pop` |
| `colorScheme` | `light` |
| `accentColor` | `#3B82F6` |
| `shotDurationFrames` | `75` |

**Writing rules:**
- Each step shot: `text` = "第N步：[action]", `keyword` = the action verb
- Steps should be parallel in structure (all imperative, or all noun phrases)
- Use `stepNumber` field (1-based) on each step shot

---

### 3. 概念解释 (concept-explain)

**When to use:**  
Defining a term, unpacking jargon, or explaining an idea using analogy.  
Examples: "什么是提示词工程", "RAG到底是什么", "Agent和Bot有什么区别"

**Shot structure:**
1. Question shot — pose the concept as a question
2. Definition shot — plain-language answer
3. Analogy shot — "就像…"
4. Real-world example shot
5. Key insight shot — the one thing to remember

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `concept-card` |
| `motionPreset` | `highlight-sweep` |
| `animationStyle` | `smooth-reveal` |
| `colorScheme` | `dark` |
| `accentColor` | `#6366F1` |
| `shotDurationFrames` | `80` |

**Writing rules:**
- Definition shot `text` should be a single declarative sentence
- Analogy shot must use "就像" or "相当于" literally so it's recognizable
- Avoid technical acronyms in `text`; place them in `caption` with a gloss if needed

---

### 4. 金句观点 (quote-insight)

**When to use:**  
A bold, memorable opinion or insight. The kind of sentence people screenshot.  
Examples: "AI不是工具，是你的外脑", "会提问的孩子才算真的会用AI"

**Shot structure:**
- 1–3 shots maximum — let the words breathe
- Optional setup shot before the main quote
- The quote shot itself must stand alone as the hero

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `quote-hero` |
| `motionPreset` | `stat-slam` |
| `animationStyle` | `dramatic-slam` |
| `colorScheme` | `dark` |
| `accentColor` | `#EC4899` |
| `shotDurationFrames` | `105` |

**Writing rules:**
- `text` must be the quote itself — punchy, complete, standalone
- `keyword` = the most provocative word in the quote
- `caption` can credit a source or add a nuance (e.g., "吴恩达，2025年演讲")
- Do NOT dilute with excessive context shots — quote-insight works because it's sparse

---

### 5. 对比分析 (comparison)

**When to use:**  
A vs. B structure — two tools, two approaches, two perspectives, before/after.  
Examples: "免费版 vs 付费版", "传统搜索 vs AI搜索", "用AI前 vs 用AI后"

**Shot structure:**
1. Frame shot — what's being compared and why
2. Left/A shots (1–2)
3. Right/B shots (1–2)
4. Synthesis shot — clear recommendation or "when to use which"

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `comparison-split` |
| `motionPreset` | `split-slide` |
| `animationStyle` | `snappy-pop` |
| `colorScheme` | `dark` |
| `accentColor` | `#10B981` |
| `shotDurationFrames` | `80` |

**Writing rules:**
- Use `comparisonSide: "left" | "right" | "neutral"` field to label each shot
- Keep left/right labels consistent throughout all shots (e.g., left = "传统方式", right = "AI方式")
- Synthesis shot should give a concrete answer, not "视情况而定"

---

### 6. 清单盘点 (checklist)

**When to use:**  
A list of items — tools, habits, mistakes, recommendations. Audience wants to scan quickly.  
Examples: "2026值得试的5个AI工具", "家长最常犯的3个错误", "每周必做的AI习惯"

**Shot structure:**
- 1 hook shot (the list premise — urgency or scarcity)
- 1 shot per item (or group 2 small items per shot if list is long)
- 1 closing action shot

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `checklist-reveal` |
| `motionPreset` | `check-draw` |
| `animationStyle` | `smooth-reveal` |
| `colorScheme` | `light` |
| `accentColor` | `#10B981` |
| `shotDurationFrames` | `75` |

**Writing rules:**
- Each item shot `text` = the item name/label, concise (noun phrase preferred)
- `caption` = one-sentence rationale for why this item matters
- Use `listIndex` field (1-based) on item shots to enable stagger animation
- Hook shot creates urgency: "只有5个" / "90%的人不知道" / "别等到用错了才后悔"

---

### 7. 时间线 (timeline)

**When to use:**  
Historical sequence, evolution, roadmap, or chronological narrative.  
Examples: "AI发展的6个关键节点", "ChatGPT这两年经历了什么", "孩子AI学习路线图"

**Shot structure:**
- 1 anchor shot — title + the full year range
- 1 shot per milestone (3–5 milestones ideal; 6 is max)
- 1 "where we are / what's next" closing shot

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `timeline-flow` |
| `motionPreset` | `dot-appear` |
| `animationStyle` | `smooth-reveal` |
| `colorScheme` | `dark` |
| `accentColor` | `#F59E0B` |
| `shotDurationFrames` | `85` |

**Writing rules:**
- Milestone shot `text` = "[year]：[event]" — year is always included
- `keyword` = the year or the key noun of the event
- Use `timelineYear` field for the year string (enables timeline dot positioning)
- Include only milestones that actually changed things — no filler dates
- Closing shot should connect the timeline to something the viewer can act on today
