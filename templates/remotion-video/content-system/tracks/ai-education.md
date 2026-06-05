# Track: 亲子AI教育 (Parent-Child AI Education)

Target audience: Parents coaching children (ages 4–14) on AI literacy. Also children directly.  
Tone: Warm, encouraging, concrete. Never scary about AI. Never preachy.  
Format: Short-form vertical video (1080×1920, 30fps).

---

## Content Types

### 1. AI概念启蒙 (ai-concept)

**When to use:**  
Explaining an AI concept in kid-friendly terms using analogy or character.  
Examples: "AI是什么", "为什么AI有时候会说错", "AI怎么学习的"

**Shot structure:**
1. Hook — a question a child would actually ask
2. Character intro — the AI character reacts or sets up
3. Analogy shot — "AI就像…"
4. Concrete example — something from daily life
5. Kid takeaway — one sentence a child can repeat

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `ai-intro` |
| `motionPreset` | `character-bounce` |
| `animationStyle` | `bouncy-enter` |
| `colorScheme` | `light` |
| `accentColor` | `#F97316` |
| `shotDurationFrames` | `90` |

**Writing rules:**
- `text` should be speakable by a child or a parent to a child
- Avoid technical terms in `text`; if needed, define them in `caption`
- Use `characterName` field (e.g., `"豆豆"`) when a character appears in the shot
- Analogy shot must use "就像" literally

---

### 2. 亲子互动挑战 (family-challenge)

**When to use:**  
A structured activity for parent and child to do together with AI.  
Examples: "今天和孩子一起试试这个", "5分钟家庭AI挑战", "用AI帮孩子写生日卡"

**Shot structure:**
1. Challenge intro — what we're doing today and why it's fun
2. Setup shot — what you need / how to start
3. Steps (2–3 shots) — what parent does, what child does
4. Result shot — what success looks like
5. Celebration / encouragement shot

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `challenge-game` |
| `motionPreset` | `star-burst` |
| `animationStyle` | `bouncy-enter` |
| `colorScheme` | `light` |
| `accentColor` | `#8B5CF6` |
| `shotDurationFrames` | `90` |

**Writing rules:**
- Use `ageTarget` field: `"4-6"`, `"7-10"`, or `"11-14"` — this affects text complexity
- Challenge intro `text` should create anticipation ("今天我们要…一起来！")
- Steps should alternate parent/child roles explicitly
- Keep total time commitment implied ≤ 15 minutes

---

### 3. 故事化场景 (story-scene)

**When to use:**  
AI appears in a relatable real-life situation — homework, creativity, curiosity.  
Examples: "小明用AI写作文被老师发现了", "妈妈和孩子一起问AI做晚饭", "孩子问AI为什么天空是蓝的"

**Shot structure:**
1. Scene setup — introduce the characters and situation
2. Problem or question moment
3. AI interaction — what was said/asked
4. Outcome — what happened
5. Reflection — what the family learned or felt

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `story-moment` |
| `motionPreset` | `character-bounce` |
| `animationStyle` | `smooth-reveal` |
| `colorScheme` | `light` |
| `accentColor` | `#F97316` |
| `shotDurationFrames` | `95` |

**Writing rules:**
- Use character names consistently throughout shots — pick one child name and stick to it
- Outcome shot must show a *human* action or insight, not just an AI response
- Reflection shot is optional but powerful — "后来我们发现…"
- Use TransitionSeries with light-leak overlays between major scene shifts

---

### 4. 使用演示 (usage-demo)

**When to use:**  
Step-by-step walkthrough of how to use an AI tool — for parents or older children.  
Examples: "手把手教你用ChatGPT帮孩子预习", "怎么让AI出一份练习题", "孩子自己用Kimi查资料的流程"

**Shot structure:**
1. Goal shot — what we're trying to accomplish
2. Open/start step
3. Key interaction steps (2–4 shots, one action per shot)
4. Review step — checking the output
5. Done / result shot

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `demo-walk` |
| `motionPreset` | `highlight-sweep` |
| `animationStyle` | `snappy-pop` |
| `colorScheme` | `light` |
| `accentColor` | `#3B82F6` |
| `shotDurationFrames` | `85` |

**Writing rules:**
- Goal shot `text` must state the outcome, not the tool ("让孩子预习完一章内容" not "打开ChatGPT")
- Each step shot `text` = one imperative action ("输入你的问题", "点击发送")
- `keyword` = the key verb or UI element
- Use `stepNumber` field (1-based) on action shots
- Do NOT show actual AI output text in `text` — summarize what to do with it instead

---

### 5. 安全边界 (safety-rule)

**When to use:**  
Rules, limits, warnings about AI use — what children should and shouldn't do.  
Examples: "孩子用AI的3条家规", "这件事不能让AI替你做", "发现AI说错了怎么办"

**Shot structure:**
1. Framing shot — why this boundary exists (caring, not scary)
2. The rule (1–2 shots) — clear, stated positively where possible
3. What happens if ignored — brief, real consequence
4. What to do instead — always give an alternative
5. Reassurance shot — AI is still good; we're just being smart

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `boundary-card` |
| `motionPreset` | `warning-pulse` |
| `animationStyle` | `snappy-pop` |
| `colorScheme` | `dark` |
| `accentColor` | `#F59E0B` |
| `shotDurationFrames` | `85` |

**Writing rules:**
- Never use red (`#EF4444`) as accent — amber is firm without being alarming
- Rule shot `text` should be stated as a positive habit when possible ("先自己想一遍，再问AI" not "不能直接问AI")
- Reassurance shot is required — do not end on a warning
- `caption` on rule shots should explain the *why*, not repeat the rule

---

### 6. 成就时刻 (achievement)

**When to use:**  
Celebrating a child's milestone, progress, or creative output with AI.  
Examples: "孩子第一次自己用AI完成了作业", "恭喜你掌握了提问技巧", "这周AI学习打卡完成"

**Shot structure:**
1. Achievement announcement — what was accomplished
2. The effort behind it — how they got there
3. What this skill unlocks — why it matters
4. Celebration shot — pure joy, no information
5. Next challenge teaser — keeps momentum

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `celebrate-win` |
| `motionPreset` | `confetti-burst` |
| `animationStyle` | `bouncy-enter` |
| `colorScheme` | `light` |
| `accentColor` | `#10B981` |
| `shotDurationFrames` | `100` |

**Writing rules:**
- Achievement shot `text` must name the specific accomplishment, not be generic ("学会了追问AI给出来源" not "做得很好")
- Celebration shot `text` can break the information rule — it can be pure emotion ("太棒了！")
- Use `lottieUrl` field on celebration shot — point to a confetti or star Lottie from LottieFiles
- Next challenge should be concrete and achievable within a week

---

### 7. 问答揭晓 (qa-reveal)

**When to use:**  
Question is posed to the viewer → answer is revealed. Builds curiosity and delivers insight.  
Examples: "你知道AI最怕什么问题吗", "孩子问了这个问题，AI答不上来", "测测你：什么是幻觉"

**Shot structure:**
1. Question shot — the question, nothing else
2. Tension shot (optional) — hint or misdirect
3. Answer reveal shot — the answer springs in
4. Explanation shot — why this answer matters
5. Apply-it shot — one thing to try based on the answer

**Visual defaults:**
| Field | Value |
|-------|-------|
| `scene` | `qa-flip` |
| `motionPreset` | `question-wobble` |
| `animationStyle` | `bouncy-enter` |
| `colorScheme` | `light` |
| `accentColor` | `#6366F1` |
| `shotDurationFrames` | `90` |

**Writing rules:**
- Question shot `text` must end with `？` — it's a genuine question to the viewer
- `keyword` on question shot = the mystery word (the thing being revealed)
- Answer reveal shot uses `motionPreset: "reveal-spring"` — override the track default for this shot only
- Answer must be surprising or non-obvious — if it's obvious, use a different content type
- Apply-it shot connects directly to the `ai-education` mission: the child can do something with this
