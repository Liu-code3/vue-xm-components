/** 提示词条目 */
export interface PromptItem {
  key?: string | number
  /** 标题，也是点击后填入输入框的默认文案 */
  label: string
  /** 补充说明 */
  description?: string
  /** 图标文案，例如 emoji，也可以用 #icon 插槽 */
  icon?: string
  /** 允许业务透传额外字段，点击时原样带出 */
  [key: string]: unknown
}
