<script setup lang="ts">
import type { ThoughtChainItem, ThoughtChainStatus } from '../type'
import { createItemKey } from '../utils'
import ChainItem from './ChainItem.vue'

/**
 * 显式声明插槽类型
 * 递归组件如果不声明，`$slots` 的类型会由自身推导出来，形成循环引用报 TS7022
 */
defineSlots<{
  icon?: (props: { item: ThoughtChainItem; index: number; status?: ThoughtChainStatus }) => unknown
  title?: (props: { item: ThoughtChainItem; index: number }) => unknown
  description?: (props: { item: ThoughtChainItem; index: number }) => unknown
  extra?: (props: { item: ThoughtChainItem; index: number }) => unknown
  content?: (props: { item: ThoughtChainItem; index: number }) => unknown
  /** 内部插槽：由 ChainItem 交给列表组件渲染子链 */
  'sub-chain'?: (props: { items: ThoughtChainItem[]; path: string }) => unknown
}>()

withDefaults(defineProps<{
  /** 当前层级的节点集合 */
  items: ThoughtChainItem[]
  /** 层级，0 为根层，用于缩进 */
  level?: number
  /** 父级路径，如 "0-1"，保证递归下生成的 key 唯一 */
  path?: string
}>(), {
  level: 0,
  path: ''
})

/** 需要向外透传的插槽，写成常量数组，模板里才能拿到字面量类型 */
const SLOT_NAMES = ['icon', 'title', 'description', 'extra', 'content'] as const
</script>

<template>
  <ul class="xm-tc-list" :class="{ 'is-nested': level > 0 }">
    <ChainItem
        v-for="(item, index) in items"
        :key="createItemKey(item, path, index)"
        :item="item"
        :item-key="createItemKey(item, path, index)"
        :index="index"
        :level="level"
        :is-last="index === items.length - 1"
    >
      <!-- 把使用方传入的插槽原样透传下去，嵌套层也能自定义渲染 -->
      <template v-for="name in SLOT_NAMES" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}" />
      </template>

      <!-- 子链递归：由列表组件自引用渲染，ChainItem 只负责留一个插槽位置 -->
      <template #sub-chain="{ items: subItems, path: subPath }">
        <ChainList :items="subItems" :level="level + 1" :path="subPath">
          <template v-for="name in SLOT_NAMES" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}" />
          </template>
        </ChainList>
      </template>
    </ChainItem>
  </ul>
</template>

<style scoped>
.xm-tc-list.is-nested {
  margin-top: 8px;
  padding-left: calc(var(--xm-tc-node) + var(--xm-tc-gap));
}
</style>
