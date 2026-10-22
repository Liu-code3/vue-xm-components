<script setup lang="ts">
import type { ButtonShape, ButtonSize, ButtonType } from './type'

const props = withDefaults(defineProps<{
  /** 按钮类型 */
  type?: ButtonType
  /** 尺寸 */
  size?: ButtonSize
  /** 形状，circle 用于纯图标按钮 */
  shape?: ButtonShape
  /** 危险按钮 */
  danger?: boolean
  /** 撑满父容器 */
  block?: boolean
  disabled?: boolean
  /** 加载中，同时会禁用点击 */
  loading?: boolean
  /** 原生 type */
  htmlType?: 'button' | 'submit' | 'reset'
}>(), {
  type: 'default',
  size: 'middle',
  shape: 'default',
  danger: false,
  block: false,
  disabled: false,
  loading: false,
  htmlType: 'button'
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function onClick(event: MouseEvent) {
  // 加载中 / 禁用时不派发事件，避免业务重复提交
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
      class="xm-btn"
      :class="[
        `xm-btn--${type}`,
        `xm-btn--${size}`,
        `xm-btn--${shape}`,
        { 'is-danger': danger, 'is-block': block, 'is-loading': loading }
      ]"
      :type="htmlType"
      :disabled="disabled || loading"
      @click="onClick"
  >
    <span v-if="loading" class="xm-btn__spinner" aria-hidden="true" />
    <span v-else-if="$slots.icon" class="xm-btn__icon">
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>

<style scoped>
.xm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--xm-control-height);
  padding: 0 15px;
  border: 1px solid var(--xm-color-border);
  border-radius: var(--xm-radius);
  background: var(--xm-color-bg);
  color: var(--xm-color-text);
  font-family: inherit;
  font-size: var(--xm-font-size);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--xm-motion) var(--xm-ease), border-color var(--xm-motion) var(--xm-ease),
    background-color var(--xm-motion) var(--xm-ease);
}

.xm-btn:hover:not(:disabled) {
  color: var(--xm-color-primary-hover);
  border-color: var(--xm-color-primary-hover);
}

.xm-btn:active:not(:disabled) {
  color: var(--xm-color-primary-active);
  border-color: var(--xm-color-primary-active);
}

.xm-btn:focus-visible {
  outline: 2px solid var(--xm-color-primary);
  outline-offset: 2px;
}

.xm-btn:disabled {
  color: var(--xm-color-text-quaternary);
  background: var(--xm-color-fill);
  border-color: var(--xm-color-border);
  cursor: not-allowed;
}

/* 尺寸 */
.xm-btn--small {
  height: var(--xm-control-height-sm);
  padding: 0 7px;
  font-size: var(--xm-font-size-sm);
  border-radius: var(--xm-radius-sm);
}

.xm-btn--large {
  height: var(--xm-control-height-lg);
  padding: 0 15px;
  font-size: var(--xm-font-size-lg);
  border-radius: var(--xm-radius-lg);
}

/* 形状 */
.xm-btn--circle {
  width: var(--xm-control-height);
  padding: 0;
  border-radius: 50%;
}

.xm-btn--circle.xm-btn--small {
  width: var(--xm-control-height-sm);
}

.xm-btn--circle.xm-btn--large {
  width: var(--xm-control-height-lg);
}

.xm-btn--round {
  border-radius: 999px;
}

/* 类型 */
.xm-btn--primary {
  color: #fff;
  background: var(--xm-color-primary);
  border-color: var(--xm-color-primary);
}

.xm-btn--primary:hover:not(:disabled) {
  color: #fff;
  background: var(--xm-color-primary-hover);
  border-color: var(--xm-color-primary-hover);
}

.xm-btn--primary:active:not(:disabled) {
  color: #fff;
  background: var(--xm-color-primary-active);
  border-color: var(--xm-color-primary-active);
}

.xm-btn--dashed {
  border-style: dashed;
}

.xm-btn--text,
.xm-btn--link {
  border-color: transparent;
  background: transparent;
}

.xm-btn--text:hover:not(:disabled) {
  background: var(--xm-color-fill);
}

.xm-btn--link {
  color: var(--xm-color-primary);
}

.xm-btn--link:hover:not(:disabled) {
  color: var(--xm-color-primary-hover);
  background: transparent;
}

/* 危险态 */
.xm-btn.is-danger {
  color: var(--xm-color-error);
  border-color: var(--xm-color-error);
}

.xm-btn.is-danger:hover:not(:disabled) {
  color: #ff7875;
  border-color: #ff7875;
}

.xm-btn--primary.is-danger {
  color: #fff;
  background: var(--xm-color-error);
  border-color: var(--xm-color-error);
}

.xm-btn--primary.is-danger:hover:not(:disabled) {
  background: #ff7875;
  border-color: #ff7875;
}

.xm-btn--text.is-danger,
.xm-btn--link.is-danger {
  background: transparent;
}

.xm-btn--text.is-danger:hover:not(:disabled) {
  background: var(--xm-color-error-bg);
}

.xm-btn.is-block {
  width: 100%;
}

.xm-btn__icon {
  display: inline-flex;
  align-items: center;
  font-size: 1em;
}

.xm-btn__spinner {
  width: 1em;
  height: 1em;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: xm-btn-spin 0.8s linear infinite;
}

@keyframes xm-btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
