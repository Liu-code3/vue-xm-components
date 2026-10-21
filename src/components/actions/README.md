# Actions 操作栏

消息底部的操作按钮组，参考 Ant Design X `Actions`。图标按钮 + 可选文案，支持禁用、危险操作、选中态。

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Actions from '@/components/actions/index.vue'
import type { ActionItem } from '@/components/actions/type'

const liked = ref(false)

const items: ActionItem[] = [
  { key: 'copy', icon: 'copy', label: '复制' },
  { key: 'reload', icon: 'reload', label: '重新生成' },
  { key: 'like', icon: 'like', label: '有帮助' },
  { key: 'delete', icon: 'delete', label: '删除', danger: true }
]

function onAction(item: ActionItem) {
  if (item.key === 'like') liked.value = !liked.value
}
</script>

<template>
  <Actions :items="items" size="small" @action="onAction" />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| items | `ActionItem[]` | `[]` | 操作项 |
| size | `'small' \| 'middle'` | `'middle'` | 尺寸 |

### ActionItem

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| key | `string` | 唯一标识 |
| label | `string` | 文案，不传则纯图标 |
| icon | `'copy' \| 'reload' \| 'like' \| 'dislike' \| 'delete' \| 'edit'` | 内置图标 |
| disabled | `boolean` | 禁用 |
| danger | `boolean` | 危险操作，hover 变红 |
| active | `boolean` | 选中态，例如已点赞 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| action | `(item, index)` | 点击某个操作 |

## 要点

- 组件只负责展示与抛事件，复制、请求这些副作用留在业务层，避免组件和具体能力耦合。
- 图标用 `currentColor` 描边，颜色只由父级 `color` 控制，hover / 危险 / 选中三种态不用改 SVG。
