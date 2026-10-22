# Tag 标签

标签，对齐 Ant Design `Tag`。预设色板 + 自定义色 + 可关闭。

## 用法

```vue
<script setup lang="ts">
import Tag from '@/components/tag/index.vue'
</script>

<template>
  <Tag>默认</Tag>
  <Tag color="primary">进行中</Tag>
  <Tag color="success" closable @close="remove">已完成</Tag>
  <Tag color="error" :bordered="false">失败</Tag>
  <Tag color="#722ed1">自定义色</Tag>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| color | `TagColor \| string` | `'default'` | 预设色名或 `#RRGGBB` |
| closable | `boolean` | `false` | 展示关闭按钮 |
| bordered | `boolean` | `true` | 是否带边框 |

预设色：`default` / `primary` / `success` / `warning` / `error` / `purple` / `cyan` / `magenta`

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| close | `(event: MouseEvent)` | 点击关闭按钮 |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 标签内容 |
| icon | 内容左侧图标 |

## 要点

- 每个预设色只覆盖三个局部变量（文字、背景、边框），组件主体样式只写一遍。
- 自定义色通过行内 `--xm-tag-color` 注入，再用 `color-mix` 从同一个色值派生背景和边框，避免业务方算透明度。
