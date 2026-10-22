<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import type { TooltipPlacement, TooltipTrigger } from './type'

const props = withDefaults(defineProps<{
  /** 提示文案，复杂内容用 #content 插槽 */
  content?: string
  placement?: TooltipPlacement
  trigger?: TooltipTrigger
  /** 显示延迟（毫秒） */
  delay?: number
  disabled?: boolean
  /** 是否显示小三角 */
  arrow?: boolean
}>(), {
  content: '',
  placement: 'top',
  trigger: 'hover',
  delay: 100,
  disabled: false,
  arrow: true
})

const emit = defineEmits<{
  (e: 'openChange', open: boolean): void
}>()

const slots = useSlots()
const triggerRef = ref<HTMLElement>()
const tooltipRef = ref<HTMLElement>()

const open = ref(false)
/** 首次测量完成前先隐藏，避免在左上角闪一下 */
const ready = ref(false)
const position = ref({ top: 0, left: 0 })

const hasContent = computed(() => Boolean(props.content) || Boolean(slots.content))

let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

const GAP = 8

function updatePosition() {
  const trigger = triggerRef.value
  const tip = tooltipRef.value
  if (!trigger || !tip) return

  const rect = trigger.getBoundingClientRect()
  const tipRect = tip.getBoundingClientRect()
  let top = 0
  let left = 0

  switch (props.placement) {
    case 'bottom':
      top = rect.bottom + GAP
      left = rect.left + rect.width / 2 - tipRect.width / 2
      break
    case 'left':
      top = rect.top + rect.height / 2 - tipRect.height / 2
      left = rect.left - tipRect.width - GAP
      break
    case 'right':
      top = rect.top + rect.height / 2 - tipRect.height / 2
      left = rect.right + GAP
      break
    default:
      top = rect.top - tipRect.height - GAP
      left = rect.left + rect.width / 2 - tipRect.width / 2
  }

  // 贴边时做一次收敛，避免超出视口
  const maxLeft = window.innerWidth - tipRect.width - 4
  const maxTop = window.innerHeight - tipRect.height - 4
  position.value = {
    top: Math.min(Math.max(4, top), Math.max(4, maxTop)),
    left: Math.min(Math.max(4, left), Math.max(4, maxLeft))
  }
}

async function show() {
  if (props.disabled || !hasContent.value || open.value) return
  clearTimeout(hideTimer)
  open.value = true
  ready.value = false
  await nextTick()
  updatePosition()
  ready.value = true
  emit('openChange', true)
}

function hide() {
  clearTimeout(showTimer)
  if (!open.value) return
  open.value = false
  emit('openChange', false)
}

function scheduleShow() {
  clearTimeout(showTimer)
  showTimer = setTimeout(show, props.delay)
}

function scheduleHide() {
  clearTimeout(showTimer)
  hideTimer = setTimeout(hide, 100)
}

function onMouseenter() {
  if (props.trigger === 'hover') scheduleShow()
}

function onMouseleave() {
  if (props.trigger === 'hover') scheduleHide()
}

function onClick() {
  if (props.trigger !== 'click') return
  if (open.value) {
    hide()
  } else {
    void show()
  }
}

function onFocusin() {
  if (props.trigger === 'focus') void show()
}

function onFocusout() {
  if (props.trigger === 'focus') hide()
}

/** 点击模式：点到外部要关掉 */
function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (triggerRef.value?.contains(target) || tooltipRef.value?.contains(target)) return
  hide()
}

function onViewportChange() {
  if (open.value) updatePosition()
}

/** 鼠标移进气泡时取消自动关闭 */
function keepOpen() {
  clearTimeout(hideTimer)
}

watch(open, value => {
  if (value) {
    document.addEventListener('click', onDocumentClick)
    window.addEventListener('scroll', onViewportChange, true)
    window.addEventListener('resize', onViewportChange)
  } else {
    document.removeEventListener('click', onDocumentClick)
    window.removeEventListener('scroll', onViewportChange, true)
    window.removeEventListener('resize', onViewportChange)
  }
})

onBeforeUnmount(() => {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
})
</script>

<template>
  <span
      ref="triggerRef"
      class="xm-tooltip-trigger"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      @click="onClick"
      @focusin="onFocusin"
      @focusout="onFocusout"
  >
    <slot />
  </span>

  <Teleport to="body">
    <Transition name="xm-tooltip-fade">
      <div
          v-if="open"
          ref="tooltipRef"
          class="xm-tooltip"
          :class="[`is-${placement}`, { 'is-ready': ready }]"
          :style="{ top: `${position.top}px`, left: `${position.left}px` }"
          role="tooltip"
          @mouseenter="keepOpen"
          @mouseleave="scheduleHide"
      >
        <slot name="content">{{ content }}</slot>
        <span v-if="arrow" class="xm-tooltip__arrow" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.xm-tooltip-trigger {
  display: inline-flex;
}

.xm-tooltip {
  position: fixed;
  z-index: 1070;
  max-width: 260px;
  padding: 6px 8px;
  border-radius: var(--xm-radius);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-size: var(--xm-font-size-sm);
  line-height: 1.6;
  text-align: left;
  word-break: break-word;
  visibility: hidden;
  pointer-events: auto;
}

.xm-tooltip.is-ready {
  visibility: visible;
}

.xm-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  transform: rotate(45deg);
}

.xm-tooltip.is-top .xm-tooltip__arrow {
  bottom: -3px;
  left: 50%;
  margin-left: -4px;
}

.xm-tooltip.is-bottom .xm-tooltip__arrow {
  top: -3px;
  left: 50%;
  margin-left: -4px;
}

.xm-tooltip.is-left .xm-tooltip__arrow {
  right: -3px;
  top: 50%;
  margin-top: -4px;
}

.xm-tooltip.is-right .xm-tooltip__arrow {
  left: -3px;
  top: 50%;
  margin-top: -4px;
}

.xm-tooltip-fade-enter-active,
.xm-tooltip-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.xm-tooltip-fade-enter-from,
.xm-tooltip-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
