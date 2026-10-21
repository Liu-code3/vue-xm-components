<script setup lang="ts">
import { computed, provide, ref, toRef } from 'vue'
import type { ThoughtChainItem, ThoughtChainLine, ThoughtChainSize } from './type'
import { THOUGHT_CHAIN_KEY } from './context'
import { hasContent } from './utils'
import ChainList from './components/ChainList.vue'

const props = withDefaults(defineProps<{
  /** 思维链数据 */
  items?: ThoughtChainItem[]
  /** 尺寸 */
  size?: ThoughtChainSize
  /** 连接线样式，false 隐藏连接线 */
  line?: ThoughtChainLine
  /** 全局默认是否可折叠，单个节点可用 item.collapsible 覆盖 */
  collapsible?: boolean
  /** 手风琴模式：同一时间只展开一个节点 */
  accordion?: boolean
  /** 受控的展开项，配合 v-model:expanded-keys 使用 */
  expandedKeys?: (string | number)[]
  /** 非受控时的默认展开项 */
  defaultExpandedKeys?: (string | number)[]
}>(), {
  items: () => [],
  size: 'middle',
  line: 'solid',
  // Boolean 类型的 prop 不传时会被 Vue 转换成 false，这里显式给 undefined 保持三态：
  // 不传 -> 按节点内容判断；false -> 全部不可折叠；true -> 全部可折叠
  collapsible: undefined,
  accordion: false,
  defaultExpandedKeys: () => []
})

const emit = defineEmits<{
  (e: 'update:expandedKeys', keys: string[]): void
  (e: 'expand', expanded: boolean, item: ThoughtChainItem, key: string): void
  (e: 'itemClick', item: ThoughtChainItem, index: number): void
}>()

/** 非受控模式下的内部状态 */
const innerExpandedKeys = ref<string[]>(props.defaultExpandedKeys.map(String))

/** 受控 / 非受控合并：只要传了 expandedKeys，就以外部为准 */
const expandedKeys = computed(() => (props.expandedKeys ?? innerExpandedKeys.value).map(String))

function isCollapsible(item: ThoughtChainItem): boolean {
  return item.collapsible ?? props.collapsible ?? hasContent(item)
}

function toggle(key: string, item: ThoughtChainItem) {
  const expanded = expandedKeys.value.includes(key)
  const next = expanded
    ? expandedKeys.value.filter(item => item !== key)
    : props.accordion ? [key] : [...expandedKeys.value, key]

  // 受控模式下不修改内部状态，完全交给父组件
  if (!props.expandedKeys) {
    innerExpandedKeys.value = next
  }

  emit('update:expandedKeys', next)
  emit('expand', !expanded, item, key)
}

function onItemClick(item: ThoughtChainItem, index: number) {
  emit('itemClick', item, index)
}

provide(THOUGHT_CHAIN_KEY, {
  size: toRef(props, 'size'),
  line: toRef(props, 'line'),
  expandedKeys,
  isCollapsible,
  toggle,
  onItemClick
})
</script>

<template>
  <div
      class="xm-thought-chain"
      :class="[`xm-thought-chain--${size}`, { 'is-line-hidden': line === false }]"
  >
    <ChainList :items="items" :level="0" :path="''" />
  </div>
</template>

<style scoped>
.xm-thought-chain {
  /* 颜色 */
  --xm-tc-primary: #1677ff;
  --xm-tc-primary-weak: #bae0ff;
  --xm-tc-primary-bg: #e6f4ff;
  --xm-tc-success: #52c41a;
  --xm-tc-success-bg: #f6ffed;
  --xm-tc-error: #ff4d4f;
  --xm-tc-error-bg: #fff2f0;
  --xm-tc-text: rgba(0, 0, 0, 0.88);
  --xm-tc-text-secondary: rgba(0, 0, 0, 0.65);
  --xm-tc-text-tertiary: rgba(0, 0, 0, 0.45);
  --xm-tc-line-color: #e5e6eb;
  --xm-tc-fill: rgba(0, 0, 0, 0.04);

  /* 尺寸，由 size 修饰类覆盖 */
  --xm-tc-node: 20px;
  --xm-tc-gap: 12px;
  --xm-tc-font: 14px;

  color: var(--xm-tc-text);
  font-size: var(--xm-tc-font);
  line-height: 1.5715;
}

.xm-thought-chain--small {
  --xm-tc-node: 16px;
  --xm-tc-gap: 8px;
  --xm-tc-font: 12px;
}

.xm-thought-chain--large {
  --xm-tc-node: 24px;
  --xm-tc-gap: 16px;
  --xm-tc-font: 16px;
}
</style>
