import type { ComputedRef, Ref } from 'vue'

/** 节点状态：决定左侧图标的形态与颜色 */
export type ThoughtChainStatus = 'pending' | 'loading' | 'success' | 'error'

/** 组件尺寸 */
export type ThoughtChainSize = 'small' | 'middle' | 'large'

/** 节点之间的连接线样式，false 表示隐藏 */
export type ThoughtChainLine = false | 'solid' | 'dashed' | 'dotted'

/** 单个思维链节点 */
export interface ThoughtChainItem {
  /** 唯一标识，不传时由组件按层级路径生成 */
  key?: string | number
  /** 标题 */
  title?: string
  /** 描述，展示在标题下方 */
  description?: string
  /** 状态，默认 pending */
  status?: ThoughtChainStatus
  /** 状态文案，展示在标题右侧，如「耗时 1.2s」 */
  statusText?: string
  /** 折叠区文本内容，复杂内容请使用 #content 插槽 */
  content?: string
  /** 是否可折叠，不传时「有 content 或 children」即可折叠 */
  collapsible?: boolean
  /** 子节点，用来表达多级步骤，例如一次工具调用下的子步骤 */
  children?: ThoughtChainItem[]
}

/**
 * 通过 provide/inject 下发的上下文
 * 递归组件里如果靠 props 逐层传递，层级一深就很难维护，这里统一放进上下文
 */
export interface ThoughtChainContext {
  size: Ref<ThoughtChainSize>
  line: Ref<ThoughtChainLine>
  /** 当前展开的节点 key 集合 */
  expandedKeys: ComputedRef<string[]>
  /** 判断节点是否可折叠 */
  isCollapsible: (item: ThoughtChainItem) => boolean
  /** 切换展开状态 */
  toggle: (key: string, item: ThoughtChainItem) => void
  /** 节点点击回调，由根组件向外抛事件 */
  onItemClick: (item: ThoughtChainItem, index: number) => void
}
