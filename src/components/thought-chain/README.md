# ThoughtChain 思维链

参考 Ant Design X `ThoughtChain` 的 API 与视觉，手写实现（不依赖任何 UI 库），用来展示 Agent 的思考过程与工具调用链路。

## 特性

- 四种状态：等待中 / 进行中 / 成功 / 失败，图标与状态文案自动跟随
- 支持多级子节点，表达「一次工具调用下的子步骤」
- 展开收起、手风琴模式、受控 / 非受控两种用法
- 五个作用域插槽，可完全接管节点渲染
- 尺寸三档 + CSS 变量主题，覆盖变量即可换肤

## 快速开始

```vue
<script setup lang="ts">
import ThoughtChain from '@/components/thought-chain/index.vue'
import type { ThoughtChainItem } from '@/components/thought-chain/type'

const items: ThoughtChainItem[] = [
  {
    key: '1',
    title: '调用工具 weather.query',
    description: 'city=杭州',
    status: 'loading',
    statusText: '调用中',
    content: 'POST /tools/weather.query'
  },
  {
    key: '2',
    title: '生成回答',
    status: 'pending',
    children: [{ key: '2-1', title: '组织语言', status: 'pending' }]
  }
]
</script>

<template>
  <ThoughtChain :items="items" />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| items | `ThoughtChainItem[]` | `[]` | 节点数据 |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | 尺寸 |
| line | `false \| 'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 连接线样式，`false` 隐藏 |
| collapsible | `boolean` | - | 全局默认是否可折叠，节点上的 `collapsible` 优先 |
| accordion | `boolean` | `false` | 手风琴模式，同时只展开一个节点 |
| expandedKeys | `(string \| number)[]` | - | 受控展开项，配合 `v-model:expanded-keys` |
| defaultExpandedKeys | `(string \| number)[]` | `[]` | 非受控时的默认展开项 |

### ThoughtChainItem

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| key | `string \| number` | 唯一标识，不传时按层级路径生成 |
| title | `string` | 标题 |
| description | `string` | 描述，展示在标题下方 |
| status | `'pending' \| 'loading' \| 'success' \| 'error'` | 状态，默认 `pending` |
| statusText | `string` | 状态文案，展示在标题右侧，如「耗时 1.2s」 |
| content | `string` | 折叠区文本内容 |
| collapsible | `boolean` | 是否可折叠，默认「有 content 或 children」即可折叠 |
| children | `ThoughtChainItem[]` | 子节点 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:expandedKeys | `(keys: string[])` | 展开项变化，用于 `v-model:expanded-keys` |
| expand | `(expanded: boolean, item, key)` | 单个节点展开 / 收起 |
| itemClick | `(item, index)` | 点击节点标题 |

### Slots

| 插槽 | 参数 | 说明 |
| --- | --- | --- |
| icon | `{ item, index, status }` | 自定义状态图标 |
| title | `{ item, index }` | 自定义标题 |
| description | `{ item, index }` | 自定义描述 |
| extra | `{ item, index }` | 标题右侧附加内容 |
| content | `{ item, index }` | 折叠区内容 |

## 实现要点

1. **递归渲染**：`ChainList` 通过文件名自引用渲染子链；`ChainItem` 只留一个 `sub-chain` 插槽，不直接引用 `ChainList`，避免两个组件循环依赖。
2. **provide / inject**：尺寸、线型、展开状态、切换方法统一放进上下文，递归层级里不用逐层透传 props。
3. **受控 / 非受控**：传了 `expandedKeys` 就以外部为准，否则用内部状态；两种模式都会抛出 `update:expandedKeys`。
4. **折叠动画**：`grid-template-rows: 0fr → 1fr`，不需要测量内容高度，异步内容变化也能自适应。
5. **插槽透传**：`ChainList` 用 `v-for="(_, name) in $slots"` 动态转发所有插槽，保证嵌套层同样能自定义渲染。
6. **主题**：颜色和尺寸全部走 `--xm-tc-*` 变量，覆盖根节点变量即可换肤。

## 可以继续扩展

- 新增节点时自动滚动到进行中的节点
- 统计每个节点耗时并汇总
- 对接 SSE / 流式消息，边接收边更新状态
