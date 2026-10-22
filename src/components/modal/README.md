# Modal 对话框

模态对话框，对齐 Ant Design `Modal`。Teleport 到 body、遮罩、ESC 关闭、滚动锁定、焦点还原。

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/modal/index.vue'
import Button from '@/components/button/index.vue'

const open = ref(false)
const loading = ref(false)

async function submit() {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false
  open.value = false
}
</script>

<template>
  <Button type="primary" @click="open = true">打开弹窗</Button>

  <Modal v-model:open="open" title="编辑信息" :confirm-loading="loading" @ok="submit">
    <p>弹窗内容</p>
  </Modal>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| open | `boolean` | `false` | 是否显示，配合 `v-model:open` |
| title | `string` | `''` | 标题 |
| width | `string \| number` | `520` | 宽度，数字按 px |
| closable | `boolean` | `true` | 显示关闭按钮 |
| maskClosable | `boolean` | `true` | 点击遮罩关闭 |
| keyboard | `boolean` | `true` | 按 ESC 关闭 |
| footer | `boolean` | `true` | 显示底部按钮 |
| confirmLoading | `boolean` | `false` | 确定按钮加载中 |
| okText / cancelText | `string` | `'确定'` / `'取消'` | 按钮文案 |
| centered | `boolean` | `false` | 垂直居中 |

### Events

| 事件 | 说明 |
| --- | --- |
| update:open | 显隐变化，用于 `v-model:open` |
| ok | 点击确定 |
| cancel | 点击取消 / 关闭 / 遮罩 / ESC |
| afterClose | 关闭动画结束 |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 弹窗内容 |
| title | 自定义标题 |
| footer | 自定义底部，替换默认按钮 |

## 要点

- 内容用 `v-show` 保留在 DOM 里，关闭不会销毁表单；需要每次重置可在 `afterClose` 里处理。
- 打开时锁 `body` 滚动、记录当前焦点，关闭后还原，避免焦点丢失到页面顶部。
- 底部按钮直接复用 `Button` 组件，弹窗本身不重复实现按钮样式。
