# 给 Codex 的使用说明

收到视频生成请求时，按以下步骤执行。

## 步骤

**1. 读取生成规则**

```
read_file("content-system/system-prompt.md")
```

**2. 判断赛道，读取对应规则**

```
read_file("content-system/tracks/knowledge-sharing.md")
# 或
read_file("content-system/tracks/ai-education.md")
```

**3. 按需查阅视觉规则**

```
read_file("content-system/visual-rules/schemas.md")          ← 必读，JSON 结构定义
read_file("content-system/visual-rules/scenes.md")           ← 查 scene ID
read_file("content-system/visual-rules/motion-presets.md")   ← 查 motionPreset ID
read_file("content-system/visual-rules/animation-styles.md") ← 查 animationStyle ID
read_file("content-system/visual-rules/color-palettes.md")   ← 查配色
read_file("content-system/visual-rules/typography.md")       ← 查字体
```

**4. 参考示例**

```
read_file("content-system/examples/knowledge-example.json")
read_file("content-system/examples/education-example.json")
```

**5. 输出 JSON，写入文件**

```
write_file("src/data/<topic-slug>.ts", content)
```

格式：
```ts
export const script = { /* 生成的 JSON，符合 schemas.md 结构 */ };
```

## 触发词示例

- "帮我生成一个关于 X 的视频脚本"
- "make a video about X"
- "生成知识干货视频：……"
- "生成亲子AI教育视频：……"
