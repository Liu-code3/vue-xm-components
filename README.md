# XMUI 组件练习

手写 Vue 3 + TypeScript 组件，参考 Ant Design / Ant Design X 的交互与视觉，用来练习组件封装。

## 组件

| 组件 | 说明 | 目录 |
| --- | --- | --- |
| ThoughtChain 思维链 | Agent 执行步骤，状态图标、多级子节点、展开收起 | `src/components/thought-chain` |
| Bubble 消息气泡 | 对话消息容器，左右布局、填充 / 描边、加载态 | `src/components/bubble` |
| Sender 输入框 | 高度自适应、回车发送、输入法保护、字数统计 | `src/components/sender` |
| Prompts 提示词 | 快捷提问卡片，数据驱动 + 插槽自定义 | `src/components/prompts` |
| Actions 操作栏 | 消息操作按钮组，支持禁用 / 危险 / 选中态 | `src/components/actions` |
| Cascade 级联选择 | 省市区三级联动 | `src/components/Cascade` |
| DropDownMenu 下拉选择 | 搜索 + 下拉选择 | `src/components/drop-down-menu` |

## 开发

```bash
pnpm install
pnpm dev     # http://localhost:6161
pnpm build
```

## 约定

- 一个组件一个目录：`index.vue` 是入口，`components/` 放子组件，`type/` 放类型，`utils/` 放工具函数。
- 不依赖第三方 UI 库，颜色和尺寸统一走 CSS 变量，覆盖根节点变量即可换肤。
- 组件只负责结构与交互，请求、复制等副作用交给业务层。
