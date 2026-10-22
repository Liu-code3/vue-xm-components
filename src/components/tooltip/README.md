# Tooltip 文字提示

文字提示气泡，对齐 Ant Design `Tooltip`。支持四个方向、三种触发方式、延迟显示。

## 用法

```vue
<script setup lang="ts">
import Tooltip from '@/components/tooltip/index.vue'
</script>

<template>
  <Tooltip content="复制链接">
    <button type="button">复制</button>
  </Tooltip>

  <Tooltip content="下方提示" placement="bottom">
    <span>hover 我</span>
  </Tooltip>

  <Tooltip trigger="click" placement="right">
    <template #content>
      <strong>富文本内容</strong>
    </template>
    <button type="button">点击查看</button>
  </Tooltip>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| content | `string` | `''` | 提示文案 |
| placement | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 出现位置 |
| trigger | `'hover' \| 'click' \| 'focus'` | `'hover'` | 触发方式 |
| delay | `number` | `100` | 显示延迟（毫秒） |
| disabled | `boolean` | `false` | 禁用 |
| arrow | `boolean` | `true` | 是否显示小三角 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| openChange | `(open: boolean)` | 显示状态变化 |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 触发元素 |
| content | 自定义气泡内容 |

## 要点

- 气泡通过 `Teleport` 挂到 `body`，避免被父级 `overflow: hidden` 裁掉。
- 定位用 `position: fixed` + `getBoundingClientRect()`，先渲染再测量，测量完成前 `visibility: hidden`，防止在左上角闪一下。
- 显示后监听 `scroll`（捕获阶段）和 `resize` 重新定位，页面滚动时气泡跟着走，而不是错位。
- 鼠标移进气泡会取消自动关闭，方便用户选中里面的文字。
