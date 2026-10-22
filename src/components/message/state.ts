import { reactive } from 'vue'
import type { MessageItem, MessageType } from './type'

/** 全局消息队列，命令式 API 和渲染组件共享这一份状态 */
export const messageList = reactive<MessageItem[]>([])

let seed = 0

export function pushMessage(type: MessageType, content: string, duration: number): number {
  const id = ++seed
  messageList.push({ id, type, content, duration })
  return id
}

export function removeMessage(id: number) {
  const index = messageList.findIndex(item => item.id === id)
  if (index > -1) messageList.splice(index, 1)
}

export function clearMessages() {
  messageList.splice(0, messageList.length)
}
