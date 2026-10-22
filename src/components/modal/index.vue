<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import Button from '../button/index.vue'

const props = withDefaults(defineProps<{
  /** 是否显示，配合 v-model:open */
  open?: boolean
  title?: string
  /** 宽度，数字按 px 处理 */
  width?: string | number
  closable?: boolean
  /** 点击遮罩关闭 */
  maskClosable?: boolean
  /** 按 ESC 关闭 */
  keyboard?: boolean
  /** 是否显示底部按钮 */
  footer?: boolean
  /** 确定按钮加载中 */
  confirmLoading?: boolean
  okText?: string
  cancelText?: string
  /** 垂直居中 */
  centered?: boolean
}>(), {
  open: false,
  title: '',
  width: 520,
  closable: true,
  maskClosable: true,
  keyboard: true,
  footer: true,
  confirmLoading: false,
  okText: '确定',
  cancelText: '取消',
  centered: false
})

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'ok'): void
  (e: 'cancel'): void
  (e: 'afterClose'): void
}>()

const dialogRef = ref<HTMLElement>()
const dialogWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width
)

/** 关闭前记录焦点和滚动位置，关闭后还原 */
let lastActive: HTMLElement | null = null
let prevOverflow = ''

function close() {
  emit('update:open', false)
  emit('cancel')
}

function onMaskClick() {
  if (props.maskClosable) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !props.keyboard) return
  event.stopPropagation()
  close()
}

watch(
  () => props.open,
  async open => {
    if (open) {
      lastActive = document.activeElement as HTMLElement
      prevOverflow = document.body.style.overflow
      // 锁住页面滚动，避免弹窗打开时背景还能滚
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      dialogRef.value?.focus()
    } else {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeydown)
      lastActive?.focus?.()
      emit('afterClose')
    }
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  if (props.open) document.body.style.overflow = prevOverflow
})
</script>

<template>
  <Teleport to="body">
    <Transition name="xm-modal">
      <div v-show="open" class="xm-modal" :class="{ 'is-centered': centered }">
        <div class="xm-modal__mask" @click="onMaskClick" />

        <div
            ref="dialogRef"
            class="xm-modal__dialog"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            :style="{ width: dialogWidth }"
        >
          <div v-if="title || $slots.title || closable" class="xm-modal__header">
            <div class="xm-modal__title">
              <slot name="title">{{ title }}</slot>
            </div>
            <button
                v-if="closable"
                class="xm-modal__close"
                type="button"
                aria-label="关闭"
                @click="close"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                    d="M4.2 4.2 11.8 11.8 M11.8 4.2 4.2 11.8"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <div class="xm-modal__body">
            <slot />
          </div>

          <div v-if="footer" class="xm-modal__footer">
            <slot name="footer">
              <Button @click="close">{{ cancelText }}</Button>
              <Button type="primary" :loading="confirmLoading" @click="emit('ok')">
                {{ okText }}
              </Button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.xm-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 100px 16px 40px;
  overflow: auto;
}

.xm-modal.is-centered {
  align-items: center;
  padding: 24px 16px;
}

.xm-modal__mask {
  position: fixed;
  inset: 0;
  background: var(--xm-color-bg-mask);
}

.xm-modal__dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: calc(100vh - 140px);
  border-radius: var(--xm-radius-lg);
  background: var(--xm-color-bg);
  box-shadow: var(--xm-shadow);
  outline: none;
}

.xm-modal__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 24px 8px;
}

.xm-modal__title {
  flex: 1;
  min-width: 0;
  font-size: var(--xm-font-size-lg);
  font-weight: 600;
  line-height: 1.5;
  color: var(--xm-color-text);
  overflow-wrap: anywhere;
}

.xm-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 24px;
  height: 24px;
  margin-top: -2px;
  padding: 0;
  border: 0;
  border-radius: var(--xm-radius-sm);
  background: transparent;
  color: var(--xm-color-text-tertiary);
  cursor: pointer;
  transition: background-color var(--xm-motion) var(--xm-ease), color var(--xm-motion) var(--xm-ease);
}

.xm-modal__close:hover {
  background: var(--xm-color-fill);
  color: var(--xm-color-text);
}

.xm-modal__close svg {
  width: 14px;
  height: 14px;
}

.xm-modal__body {
  flex: 1;
  min-height: 0;
  padding: 8px 24px 20px;
  overflow-y: auto;
  font-size: var(--xm-font-size);
  line-height: 1.7;
  color: var(--xm-color-text-secondary);
}

.xm-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 24px 16px;
}

/* 动画 */
.xm-modal-enter-active,
.xm-modal-leave-active {
  transition: opacity 0.2s var(--xm-ease);
}

.xm-modal-enter-active .xm-modal__dialog,
.xm-modal-leave-active .xm-modal__dialog {
  transition: transform 0.2s var(--xm-ease);
}

.xm-modal-enter-from,
.xm-modal-leave-to {
  opacity: 0;
}

.xm-modal-enter-from .xm-modal__dialog,
.xm-modal-leave-to .xm-modal__dialog {
  transform: scale(0.94);
}
</style>
