# Switch 开关

开关选择器，对齐 Ant Design `Switch`。

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Switch from '@/components/switch/index.vue'

const enabled = ref(true)
</script>

<template>
  <Switch v-model:checked="enabled" />
  <Switch v-model:checked="enabled" checked-text="开" un-checked-text="关" />
  <Switch :checked="true" loading />
  <Switch size="small" disabled />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | 是否选中，配合 `v-model:checked` |
| disabled | `boolean` | `false` | 禁用 |
| loading | `boolean` | `false` | 加载中，同时禁用点击 |
| size | `'small' \| 'middle'` | `'middle'` | 尺寸 |
| checkedText | `string` | `''` | 选中时的文案 |
| unCheckedText | `string` | `''` | 未选中时的文案 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:checked | `(value: boolean)` | 状态变化，用于 `v-model:checked` |
| change | `(value: boolean)` | 状态变化 |

## 要点

- 用 `role="switch"` + `aria-checked` 表达语义，键盘空格 / 回车可直接切换（原生 button 行为）。
- 滑块用 `left: calc(100% - 20px)` 定位，宽度由内容决定时也能正确贴到右侧，不用写死轨道宽度。
- 带文案时通过左右 `padding` 给滑块让位，轨道自动撑开。
