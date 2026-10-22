<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { TabItem, TabsType } from './type'

const props = withDefaults(defineProps<{
  /** 标签数据 */
  items?: TabItem[]
  /** 受控的选中项，配合 v-model:active-key */
  activeKey?: string | number
  /** 非受控时的默认选中项 */
  defaultActiveKey?: string | number
  type?: TabsType
  size?: 'small' | 'middle'
  centered?: boolean
}>(), {
  items: () => [],
  type: 'line',
  size: 'middle',
  centered: false
})

const emit = defineEmits<{
  (e: 'update:activeKey', key: string | number): void
  (e: 'change', key: string | number): void
}>()

const innerKey = ref<string | number>(props.defaultActiveKey ?? props.items[0]?.key ?? '')
const currentKey = computed(() => props.activeKey ?? innerKey.value)
const currentItem = computed(() => props.items.find(item => item.key === currentKey.value))

const navRef = ref<HTMLElement>()
const tabRefs = ref<HTMLElement[]>([])
/** 滑块位置，靠测量真实 DOM 得到，标签宽度变化也能跟上 */
const indicator = ref({ left: 0, width: 0 })

function updateIndicator() {
  const index = props.items.findIndex(item => item.key === currentKey.value)
  const el = tabRefs.value[index]
  if (!el) {
    indicator.value = { left: 0, width: 0 }
    return
  }
  indicator.value = { left: el.offsetLeft, width: el.offsetWidth }
}

function select(item: TabItem, focus = false) {
  if (item.disabled) return
  if (item.key !== currentKey.value) {
    if (props.activeKey === undefined) innerKey.value = item.key
    emit('update:activeKey', item.key)
    emit('change', item.key)
  }
  if (focus) {
    const index = props.items.findIndex(i => i.key === item.key)
    tabRefs.value[index]?.focus()
  }
}

/** 键盘左右切换，符合 tabs 的无障碍约定 */
function onKeydown(event: KeyboardEvent) {
  const enabled = props.items.filter(item => !item.disabled)
  if (enabled.length === 0) return

  const index = enabled.findIndex(item => item.key === currentKey.value)
  let next = -1

  if (event.key === 'ArrowRight') next = (index + 1) % enabled.length
  else if (event.key === 'ArrowLeft') next = (index - 1 + enabled.length) % enabled.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = enabled.length - 1

  if (next < 0) return
  event.preventDefault()
  select(enabled[next], true)
}

let observer: ResizeObserver | undefined

onMounted(() => {
  updateIndicator()
  if (navRef.value) {
    observer = new ResizeObserver(updateIndicator)
    observer.observe(navRef.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())

watch(currentKey, () => nextTick(updateIndicator))
watch(() => props.items.length, () => nextTick(updateIndicator))
</script>

<template>
  <div
      class="xm-tabs"
      :class="[`xm-tabs--${type}`, `xm-tabs--${size}`, { 'is-centered': centered }]"
  >
    <div ref="navRef" class="xm-tabs__nav" role="tablist" @keydown="onKeydown">
      <button
          v-for="item in items"
          :key="item.key"
          ref="tabRefs"
          class="xm-tabs__tab"
          :class="{ 'is-active': item.key === currentKey, 'is-disabled': item.disabled }"
          type="button"
          role="tab"
          :aria-selected="item.key === currentKey"
          :tabindex="item.key === currentKey ? 0 : -1"
          :disabled="item.disabled"
          @click="select(item)"
      >
        <span v-if="item.icon" class="xm-tabs__icon">{{ item.icon }}</span>
        {{ item.label }}
      </button>

      <span
          v-if="type === 'line'"
          class="xm-tabs__indicator"
          :style="{ width: `${indicator.width}px`, transform: `translateX(${indicator.left}px)` }"
      />
    </div>

    <div class="xm-tabs__panel" role="tabpanel">
      <slot name="content" :item="currentItem" :active-key="currentKey">
        {{ currentItem?.content }}
      </slot>
    </div>
  </div>
</template>

<style scoped>
.xm-tabs {
  display: block;
}

.xm-tabs__nav {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
}

.xm-tabs.is-centered .xm-tabs__nav {
  justify-content: center;
}

.xm-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  border: 0;
  background: transparent;
  color: var(--xm-color-text-secondary);
  font: inherit;
  font-size: var(--xm-font-size);
  line-height: 1.5;
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--xm-motion) var(--xm-ease);
}

.xm-tabs__tab:hover:not(:disabled) {
  color: var(--xm-color-primary-hover);
}

.xm-tabs__tab.is-active {
  color: var(--xm-color-primary);
}

.xm-tabs__tab:focus-visible {
  outline: 2px solid var(--xm-color-primary);
  outline-offset: 2px;
  border-radius: var(--xm-radius-sm);
}

.xm-tabs__tab:disabled {
  color: var(--xm-color-text-quaternary);
  cursor: not-allowed;
}

.xm-tabs__icon {
  font-size: 1em;
  line-height: 1;
}

/* line 类型 */
.xm-tabs--line .xm-tabs__nav {
  border-bottom: 1px solid var(--xm-color-border-secondary);
}

.xm-tabs__indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  border-radius: 1px;
  background: var(--xm-color-primary);
  transition: transform var(--xm-motion) var(--xm-ease), width var(--xm-motion) var(--xm-ease);
}

/* card 类型 */
.xm-tabs--card .xm-tabs__nav {
  gap: 2px;
  border-bottom: 1px solid var(--xm-color-border-secondary);
}

.xm-tabs--card .xm-tabs__tab {
  margin-bottom: -1px;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: var(--xm-radius-lg) var(--xm-radius-lg) 0 0;
}

.xm-tabs--card .xm-tabs__tab:hover:not(:disabled) {
  color: var(--xm-color-primary);
}

.xm-tabs--card .xm-tabs__tab.is-active {
  background: var(--xm-color-bg);
  border-color: var(--xm-color-border-secondary);
  border-bottom-color: var(--xm-color-bg);
}

/* 尺寸 */
.xm-tabs--small .xm-tabs__tab {
  padding: 8px 0;
  font-size: var(--xm-font-size-sm);
}

.xm-tabs--small.xm-tabs--card .xm-tabs__tab {
  padding: 5px 12px;
}

.xm-tabs__panel {
  padding-top: 16px;
  font-size: var(--xm-font-size);
  line-height: 1.7;
  color: var(--xm-color-text-secondary);
}
</style>
