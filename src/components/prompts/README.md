# Prompts 提示词

对话开场或空状态下的快捷提问卡片，参考 Ant Design X `Prompts`。数据驱动，支持图标、描述、自定义渲染。

## 用法

```vue
<script setup lang="ts">
import Prompts from '@/components/prompts/index.vue'
import type { PromptItem } from '@/components/prompts/type'

const items: PromptItem[] = [
  { key: '1', label: '帮我总结这份文档', description: '提取要点与结论', icon: '📄' },
  { key: '2', label: '明天杭州天气', description: '调用天气工具查询' }
]

function onPick(item: PromptItem) {
  console.log(item.label)
}
</script>

<template>
  <Prompts title="你可以这样问我" :items="items" :columns="2" @item-click="onPick" />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| items | `PromptItem[]` | `[]` | 提示词列表 |
| title | `string` | `''` | 分组标题 |
| columns | `number` | `2` | 列数，640px 以下强制单列 |

### PromptItem

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| key | `string \| number` | 唯一标识 |
| label | `string` | 标题 |
| description | `string` | 补充说明 |
| icon | `string` | 图标文案（如 emoji），也可用 `#icon` 插槽 |
| 其他字段 | `unknown` | 业务透传，点击时原样带出 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| itemClick | `(item, index)` | 点击某条提示词 |

### Slots

| 插槽 | 参数 | 说明 |
| --- | --- | --- |
| icon | `{ item, index }` | 自定义图标 |
| label | `{ item, index }` | 自定义标题 |

## 要点

- 网格列数通过 CSS 变量 `--xm-prompts-columns` 传入，模板里不用写行内 grid 字符串。
- 交互只做「视觉反馈 + 抛事件」，点击后是填入输入框还是直接发送，交给业务决定。
