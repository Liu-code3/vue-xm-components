# Button 按钮

基础按钮，对齐 Ant Design `Button` 的类型、尺寸与状态。

## 用法

```vue
<script setup lang="ts">
import Button from '@/components/button/index.vue'
</script>

<template>
  <Button type="primary" @click="submit">提交</Button>
  <Button type="dashed">虚线按钮</Button>
  <Button type="text">文本按钮</Button>
  <Button danger>删除</Button>
  <Button type="primary" loading>提交中</Button>
  <Button shape="circle" aria-label="搜索">
    <template #icon>🔍</template>
  </Button>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'default' \| 'primary' \| 'dashed' \| 'text' \| 'link'` | `'default'` | 按钮类型 |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | 尺寸 |
| shape | `'default' \| 'circle' \| 'round'` | `'default'` | 形状 |
| danger | `boolean` | `false` | 危险态 |
| block | `boolean` | `false` | 撑满父容器 |
| disabled | `boolean` | `false` | 禁用 |
| loading | `boolean` | `false` | 加载中，同时禁用点击 |
| htmlType | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 type |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 按钮文案 |
| icon | 图标，放在文案左侧 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| click | `(event: MouseEvent)` | 点击，禁用 / 加载中不会触发 |

## 要点

- 组合式类名：`type` / `size` / `shape` 各一个修饰类，样式互不干扰，新增类型只要加一个 `--xxx` 类。
- 加载中既设置原生 `disabled`，又在事件里兜底拦截，防止父组件传了 `loading` 但没传 `disabled` 时重复提交。
- 颜色全部引用 `--xm-*` 变量，换主题不用改组件。
