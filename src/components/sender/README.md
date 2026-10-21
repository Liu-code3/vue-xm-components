# Sender 输入框

对话输入区，参考 Ant Design X `Sender`。包含自适应高度、回车发送、输入法保护、字数统计、加载/停止态。

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Sender from '@/components/sender/index.vue'

const value = ref('')
const loading = ref(false)

function onSubmit(text: string) {
  loading.value = true
  value.value = ''
  setTimeout(() => (loading.value = false), 1200)
}
</script>

<template>
  <Sender v-model="value" :loading="loading" show-count :max-length="500" @submit="onSubmit" @cancel="loading = false">
    <template #prefix>
      <button type="button">附件</button>
    </template>
  </Sender>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | `string` | `''` | 输入内容，配合 `v-model` |
| placeholder | `string` | 见默认值 | 占位文案 |
| loading | `boolean` | `false` | 生成中，按钮变成停止 |
| disabled | `boolean` | `false` | 禁用 |
| maxLength | `number` | - | 最大字数 |
| showCount | `boolean` | `false` | 展示字数统计 |
| autoSize | `boolean` | `true` | 高度随内容自适应 |
| submitType | `'enter' \| 'ctrlEnter'` | `'enter'` | 发送快捷键 |
| maxHeight | `number` | `160` | 自适应最大高度，超出滚动 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:modelValue | `(value: string)` | 输入变化 |
| submit | `(value: string)` | 发送，值为 trim 后的内容 |
| cancel | - | 点击停止按钮 |
| focus / blur | `(event: FocusEvent)` | 聚焦 / 失焦 |

### Slots

| 插槽 | 说明 |
| --- | --- |
| prefix | 左侧工具栏，例如附件、工具选择 |
| actions | 发送按钮左侧的附加操作 |

### Expose

`focus()` / `blur()` / `clear()`，通过模板 ref 调用。

## 要点

- **输入法保护**：中文拼音输入时按回车只是选词，用 `compositionstart/compositionend` + `event.isComposing` 双重判断，避免误发送。
- **自适应高度**：先 `height = 'auto'` 再读 `scrollHeight`，每次输入后重算；超过 `maxHeight` 才出现滚动条。
- **受控写法**：不直接改 DOM 值，统一 emit 出去，父组件用 `v-model` 接管，组件内部只处理光标外的逻辑。
