/** 内置图标名 */
export type ActionIconName = 'copy' | 'reload' | 'like' | 'dislike' | 'delete' | 'edit'

/** 操作项 */
export interface ActionItem {
  /** 唯一标识，点击事件里用它区分动作 */
  key: string
  /** 文案，不传则只显示图标 */
  label?: string
  /** 内置图标 */
  icon?: ActionIconName
  disabled?: boolean
  /** 危险操作，hover 变红 */
  danger?: boolean
  /** 选中态，例如已点赞 */
  active?: boolean
}
