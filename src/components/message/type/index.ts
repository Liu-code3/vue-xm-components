/** 消息类型 */
export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'

/** 单条消息 */
export interface MessageItem {
  id: number
  type: MessageType
  content: string
  /** 自动关闭时间，0 表示常驻 */
  duration: number
}

/** 打开消息的配置 */
export interface MessageConfig {
  content: string
  type?: MessageType
  /** 毫秒，传 0 不自动关闭 */
  duration?: number
}
