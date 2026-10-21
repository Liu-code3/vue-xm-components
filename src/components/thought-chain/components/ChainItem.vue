<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ThoughtChainItem } from '../type'
import { THOUGHT_CHAIN_KEY } from '../context'
import StatusIcon from './StatusIcon.vue'

const props = defineProps<{
  /** 节点数据 */
  item: ThoughtChainItem
  /** 当前节点的唯一 key，由 ChainList 统一生成 */
  itemKey: string
  /** 同级下标 */
  index: number
  /** 层级，0 为根层 */
  level: number
  /** 是否为同级最后一个，用于决定连接线是否继续向下延伸 */
  isLast: boolean
}>()

const injected = inject(THOUGHT_CHAIN_KEY)
if (!injected) {
  throw new Error('[xm-thought-chain] ChainItem 必须嵌套在 ThoughtChain 内使用')
}
const ctx = injected

/** 是否可折叠：单个节点配置优先，其次看根组件，最后看有没有内容 */
const collapsible = computed(() => ctx.isCollapsible(props.item))
const expanded = computed(() => ctx.expandedKeys.value.includes(props.itemKey))
/** 不可折叠的节点内容始终展示 */
const visible = computed(() => !collapsible.value || expanded.value)
const hasChildren = computed(() => Boolean(props.item.children?.length))

/** 末节点没有下一条线；但如果它展开了子链，线要穿过内容区把子节点接上 */
const showLine = computed(() => {
  if (ctx.line.value === false) return false
  return !props.isLast || (hasChildren.value && visible.value)
})

const contentId = computed(() => `xm-tc-content-${props.itemKey}`)
const lineStyle = computed(() => ({ borderLeftStyle: ctx.line.value || 'solid' }))

function onHeaderClick() {
  ctx.onItemClick(props.item, props.index)
  if (collapsible.value) {
    ctx.toggle(props.itemKey, props.item)
  }
}
</script>

<template>
  <li class="xm-tc-item">
    <!-- 左侧：状态图标 + 连接线 -->
    <div class="xm-tc-item__node">
      <slot name="icon" :item="item" :index="index" :status="item.status">
        <StatusIcon :status="item.status" />
      </slot>
      <span v-if="showLine" class="xm-tc-item__line" :style="lineStyle" />
    </div>

    <!-- 右侧：标题、描述、折叠内容 -->
    <div class="xm-tc-item__body">
      <component
          :is="collapsible ? 'button' : 'div'"
          class="xm-tc-item__header"
          :class="{ 'is-clickable': collapsible }"
          :type="collapsible ? 'button' : undefined"
          :aria-expanded="collapsible ? visible : undefined"
          :aria-controls="collapsible ? contentId : undefined"
          @click="onHeaderClick"
      >
        <span class="xm-tc-item__title-row">
          <span class="xm-tc-item__title">
            <slot name="title" :item="item" :index="index">{{ item.title }}</slot>
          </span>

          <span class="xm-tc-item__tail">
            <span
                v-if="item.statusText"
                class="xm-tc-item__status"
                :class="`is-${item.status || 'pending'}`"
            >
              {{ item.statusText }}
            </span>
            <slot name="extra" :item="item" :index="index" />
            <svg
                v-if="collapsible"
                class="xm-tc-item__arrow"
                :class="{ 'is-expanded': visible }"
                viewBox="0 0 16 16"
                aria-hidden="true"
            >
              <path
                  d="M4 6.5 8 10.5 12 6.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>
          </span>
        </span>

        <span v-if="item.description" class="xm-tc-item__desc">
          <slot name="description" :item="item" :index="index">{{ item.description }}</slot>
        </span>
      </component>

      <!-- 折叠区：grid 行高 0fr -> 1fr 做高度动画，不需要测量内容高度 -->
      <div
          :id="contentId"
          class="xm-tc-item__content"
          :class="{ 'is-expanded': visible }"
          :aria-hidden="!visible"
      >
        <div class="xm-tc-item__content-inner">
          <slot name="content" :item="item" :index="index">
            <p v-if="item.content" class="xm-tc-item__text">{{ item.content }}</p>
          </slot>

          <!-- 子链交给列表组件递归渲染，ChainItem 不直接依赖 ChainList，避免循环引用 -->
          <slot name="sub-chain" :items="item.children || []" :path="itemKey" />
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped>
.xm-tc-item {
  display: flex;
  gap: var(--xm-tc-gap);
}

.xm-tc-item__node {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: none;
  width: var(--xm-tc-node);
  padding-top: 2px;
}

.xm-tc-item__line {
  flex: 1;
  width: 0;
  min-height: 8px;
  margin-top: 4px;
  border-left: 1px dashed var(--xm-tc-line-color);
}

.xm-tc-item__body {
  flex: 1;
  min-width: 0;
  padding-bottom: 14px;
}

.xm-tc-item:last-child > .xm-tc-item__body {
  padding-bottom: 0;
}

.xm-tc-item__header {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: default;
}

.xm-tc-item__header.is-clickable {
  cursor: pointer;
}

.xm-tc-item__header:focus-visible {
  outline: 2px solid var(--xm-tc-primary);
  outline-offset: 3px;
  border-radius: 4px;
}

.xm-tc-item__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: var(--xm-tc-node);
}

.xm-tc-item__title {
  min-width: 0;
  font-size: var(--xm-tc-font);
  font-weight: 500;
  line-height: 1.5;
  color: var(--xm-tc-text);
  overflow-wrap: anywhere;
}

.xm-tc-item__tail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex: none;
}

.xm-tc-item__status {
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  color: var(--xm-tc-text-tertiary);
  background: var(--xm-tc-fill);
}

.xm-tc-item__status.is-success {
  color: var(--xm-tc-success);
  background: var(--xm-tc-success-bg);
}

.xm-tc-item__status.is-error {
  color: var(--xm-tc-error);
  background: var(--xm-tc-error-bg);
}

.xm-tc-item__status.is-loading {
  color: var(--xm-tc-primary);
  background: var(--xm-tc-primary-bg);
}

.xm-tc-item__arrow {
  width: 12px;
  height: 12px;
  flex: none;
  color: var(--xm-tc-text-tertiary);
  transition: transform 0.2s ease;
}

.xm-tc-item__arrow.is-expanded {
  transform: rotate(180deg);
}

.xm-tc-item__desc {
  display: block;
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--xm-tc-text-secondary);
}

.xm-tc-item__content {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.24s ease, opacity 0.24s ease;
}

.xm-tc-item__content.is-expanded {
  grid-template-rows: 1fr;
  opacity: 1;
}

.xm-tc-item__content-inner {
  min-height: 0;
  overflow: hidden;
}

.xm-tc-item__text {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--xm-tc-text-secondary);
  white-space: pre-wrap;
}
</style>
