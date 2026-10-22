# Message 全局提示

命令式全局提示，对齐 Ant Design `message`。直接调函数弹出，不需要在模板里写组件。

## 用法

```ts
import { message } from '@/components/message'

message.success('保存成功')
message.error('请求失败，请重试')
message.info('已复制到剪贴板', 1500)

// 常驻消息，手动关闭
const hide = message.loading('正在上传…', 0)
await upload()
hide.close()

// 完整配置
message.open({ content: '自定义', type: 'warning', duration: 5000 })
```

## API

### 方法

| 方法 | 参数 | 说明 |
| --- | --- | --- |
| `message.open` | `(config: MessageConfig \| string)` | 通用打开，返回 `{ close }` |
| `message.info` | `(content, duration?)` | 普通提示 |
| `message.success` | `(content, duration?)` | 成功 |
| `message.warning` | `(content, duration?)` | 警告 |
| `message.error` | `(content, duration?)` | 错误 |
| `message.loading` | `(content, duration = 0)` | 加载中，默认不自动关闭 |
| `message.destroy` | - | 清空全部 |

### MessageConfig

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| content | `string` | - | 文案 |
| type | `'info' \| 'success' \| 'warning' \| 'error' \| 'loading'` | `'info'` | 类型 |
| duration | `number` | `3000` | 自动关闭毫秒数，`0` 表示常驻 |

## 要点

- 状态放在模块级 `reactive` 数组里，函数调用只负责入队，渲染交给 `MessageHost`，两者解耦。
- 宿主组件在第一次调用时才 `render()` 到 body，避免页面加载就挂一个空节点。
- 每条消息独立计时，`close()` 只是从队列里移除，多个提示可以同时存在。
