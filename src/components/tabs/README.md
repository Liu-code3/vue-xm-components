# Tabs 标签页

标签页切换，对齐 Ant Design `Tabs`。支持 line / card 两种样式、受控切换、键盘导航。

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Tabs from '@/components/tabs/index.vue'
import type { TabItem } from '@/components/tabs/type'

const activeKey = ref('detail')

const items: TabItem[] = [
  { key: 'detail', label: '详情', content: '详情内容' },
  { key: 'log', label: '日志', content: '日志内容' },
  { key: 'setting', label: '设置', content: '设置内容', disabled: true }
]
</script>

<template>
  <Tabs v-model:active-key="activeKey" :items="items" />

  <Tabs type="card" :items="items" default-active-key="log">
    <template #content="{ item }">
      <strong>{{ item?.label }}</strong> 的自定义内容
    </template>
  </Tabs>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| items | `TabItem[]` | `[]` | 标签数据 |
| activeKey | `string \| number` | - | 受控选中项，配合 `v-model:active-key` |
| defaultActiveKey | `string \| number` | 第一项 | 非受控默认值 |
| type | `'line' \| 'card'` | `'line'` | 标签样式 |
| size | `'small' \| 'middle'` | `'middle'` | 尺寸 |
| centered | `boolean` | `false` | 居中 |

### TabItem

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| key | `string \| number` | 唯一标识 |
| label | `string` | 标签文案 |
| content | `string` | 面板默认内容 |
| icon | `string` | 图标文案 |
| disabled | `boolean` | 禁用 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:activeKey | `(key)` | 选中变化 |
| change | `(key)` | 选中变化 |

### Slots

| 插槽 | 参数 | 说明 |
| --- | --- | --- |
| content | `{ item, activeKey }` | 自定义面板内容 |

## 要点

- 滑块用 `offsetLeft` / `offsetWidth` 测量后 `translateX` 移动，比给每个标签画下边框更平滑。
- `ResizeObserver` 监听导航容器，窗口缩放、字体变化后滑块位置自动校正。
- 键盘支持 ← → Home End，`tabindex` 只让当前项可聚焦，符合 WAI-ARIA tabs 模式。
