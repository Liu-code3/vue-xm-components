import { createVNode, render } from 'vue'
import MessageHost from './MessageHost.vue'
import { clearMessages, pushMessage, removeMessage } from './state'
import type { MessageConfig } from './type'

let container: HTMLElement | null = null

/** 第一次调用时才挂载宿主组件，避免页面一进来就多一个空容器 */
function ensureHost() {
  if (container) return
  container = document.createElement('div')
  container.setAttribute('data-xm-message-root', '')
  document.body.appendChild(container)
  render(createVNode(MessageHost), container)
}

/**
 * 打开一条消息
 * @returns 句柄，可手动 close
 */
function open(config: MessageConfig | string) {
  ensureHost()

  const options: MessageConfig = typeof config === 'string' ? { content: config } : config
  const duration = options.duration ?? 3000
  const id = pushMessage(options.type ?? 'info', options.content, duration)

  if (duration > 0) {
    window.setTimeout(() => removeMessage(id), duration)
  }

  return {
    close: () => removeMessage(id)
  }
}

export const message = {
  open,
  info: (content: string, duration?: number) => open({ content, type: 'info', duration }),
  success: (content: string, duration?: number) => open({ content, type: 'success', duration }),
  warning: (content: string, duration?: number) => open({ content, type: 'warning', duration }),
  error: (content: string, duration?: number) => open({ content, type: 'error', duration }),
  /** 常驻消息，需要手动 close 或 destroy */
  loading: (content: string, duration = 0) => open({ content, type: 'loading', duration }),
  destroy: () => clearMessages()
}

export type { MessageConfig, MessageType } from './type'
