# Input 输入框

基础输入框，对齐 Ant Design `Input`：前后缀、清空、字数统计、三种状态。

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/input/index.vue'

const keyword = ref('')
</script>

<template>
  <Input v-model="keyword" placeholder="搜索" allow-clear @enter="search" />

  <Input v-model="keyword" show-count :max-length="50" status="error">
    <template #prefix>🔍</template>
    <template #suffix>.com</template>
  </Input>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | `string` | `''` | 输入值，配合 `v-model` |
| placeholder | `string` | - | 占位文案 |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | 尺寸 |
| status | `'default' \| 'error' \| 'warning'` | `'default'` | 校验状态 |
| disabled | `boolean` | `false` | 禁用 |
| readonly | `boolean` | `false` | 只读 |
| allowClear | `boolean` | `false` | 展示清空按钮，hover / 聚焦时出现 |
| maxLength | `number` | - | 最大长度 |
| showCount | `boolean` | `false` | 展示字数统计 |
| type | `'text' \| 'password' \| 'number' \| 'email' \| 'search'` | `'text'` | 原生 type |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:modelValue | `(value: string)` | 输入变化 |
| change | `(event: Event)` | 原生 input 事件 |
| clear | - | 点击清空 |
| focus / blur | `(event: FocusEvent)` | 聚焦 / 失焦 |
| enter | `(event: KeyboardEvent)` | 回车 |

### Slots

| 插槽 | 说明 |
| --- | --- |
| prefix | 前缀，例如搜索图标 |
| suffix | 后缀，例如单位、图标 |

### Expose

`focus()` / `blur()` / `select()`

## 要点

- 用外层 `div` 包住原生 `input`，边框、焦点态、前后缀都画在外层，原生输入框只负责输入，避免 `input` 上加伪元素的老套路。
- `hovering` / `focused` 用状态驱动，而不是 `:hover` 控制清空按钮，这样清空按钮在「鼠标移入或聚焦」时都能出现。
- `is-focused` 的阴影用 `box-shadow` 而不是 `outline`，不会挤压布局。
