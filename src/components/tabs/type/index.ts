/** 单个标签页 */
export interface TabItem {
  key: string | number
  label: string
  /** 面板默认内容，复杂内容用 #content 插槽 */
  content?: string
  /** 图标文案，例如 emoji */
  icon?: string
  disabled?: boolean
}

/** 标签样式 */
export type TabsType = 'line' | 'card'
