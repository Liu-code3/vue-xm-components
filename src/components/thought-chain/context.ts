import type { InjectionKey } from 'vue'
import type { ThoughtChainContext } from './type'

/**
 * 思维链上下文 key
 * 用 Symbol 作为 key，同一个页面里放多个思维链时状态互不干扰
 */
export const THOUGHT_CHAIN_KEY: InjectionKey<ThoughtChainContext> = Symbol('xm-thought-chain')
