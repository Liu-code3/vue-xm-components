import type { ThoughtChainItem } from '../type'

/**
 * 生成节点 key
 * 优先用业务传入的 key，否则用「父级路径 + 当前下标」拼一个，保证递归嵌套下也唯一
 */
export function createItemKey(item: ThoughtChainItem, path: string, index: number): string {
  return item.key != null ? String(item.key) : `${path}-${index}`
}

/** 节点是否自带可展示的内容（有文本或有子节点） */
export function hasContent(item: ThoughtChainItem): boolean {
  return Boolean(item.content || item.children?.length)
}
