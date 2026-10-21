# Bubble 消息气泡

对话场景里的消息容器，参考 Ant Design X `Bubble`。支持左右两侧、填充/描边、头像、加载态，内容区域完全交给插槽。

## 用法

```vue
<script setup lang="ts">
import Bubble from '@/components/bubble/index.vue'
</script>

<template>
  <Bubble placement="start" name="XMUI 助手" content="你好，我可以帮你查询天气。" />

  <Bubble placement="end" name="我" variant="outlined">
    明天杭州天气怎么样？
  </Bubble>

  <Bubble placement="start" loading />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| content | `string` | - | 文本内容，复杂内容用默认插槽 |
| placement | `'start' \| 'end'` | `'start'` | 靠左（助手）/ 靠右（用户） |
| variant | `'filled' \| 'outlined'` | `'filled'` | 填充 / 描边 |
| avatar | `string` | - | 头像地址 |
| name | `string` | `''` | 名称，同时作为无头像时的首字母 |
| loading | `boolean` | `false` | 三点加载动画 |
| maxWidth | `string` | `'560px'` | 气泡最大宽度 |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 气泡内容，可放组件（例如思维链） |
| avatar | 自定义头像 |
| header | 自定义名称区 |
| footer | 气泡下方附加区，例如操作栏 |

## 要点

- 左右布局用 `flex-direction: row-reverse` 实现，头像和内容顺序一次性解决，不需要写两套结构。
- 气泡圆角用「不对称圆角」制造指向感：助手左上角 4px，用户右上角 4px。
- 内容区只负责排版，不放业务样式；放思维链、表格等复杂内容时通过默认插槽传入。
