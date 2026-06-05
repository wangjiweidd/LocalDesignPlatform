# 给 Claude Code 的使用说明

收到视频生成请求时，按以下步骤执行。

## 步骤

**1. 读取生成规则**

```
Read content-system/system-prompt.md
```

**2. 判断赛道，读取对应规则**

```
Read content-system/tracks/knowledge-sharing.md
# 或
Read content-system/tracks/ai-education.md
```

**3. 按需查阅视觉规则**

```
Read content-system/visual-rules/schemas.md          ← 必读，JSON 结构定义
Read content-system/visual-rules/scenes.md           ← 查 scene ID
Read content-system/visual-rules/motion-presets.md   ← 查 motionPreset ID
Read content-system/visual-rules/animation-styles.md ← 查 animationStyle ID
Read content-system/visual-rules/color-palettes.md   ← 查配色
Read content-system/visual-rules/typography.md       ← 查字体
```

**4. 参考示例**

```
Read content-system/examples/knowledge-example.json
Read content-system/examples/education-example.json
```

**5. 输出 JSON，保存到项目**

```
Write src/data/<topic-slug>.ts
```

格式：
```ts
import type { KnowledgeScriptData } from '../content-system/visual-rules/schemas';
export const script: KnowledgeScriptData = { /* 生成的 JSON */ };
```

## 触发词示例

- "帮我生成一个关于 X 的视频脚本"
- "make a video about X"
- "生成知识干货视频：……"
- "生成亲子AI教育视频：……"
