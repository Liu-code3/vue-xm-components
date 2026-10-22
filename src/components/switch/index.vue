<script setup lang="ts">
import type { SwitchSize } from './type'

const props = withDefaults(defineProps<{
  /** 是否选中，配合 v-model:checked */
  checked?: boolean
  disabled?: boolean
  loading?: boolean
  size?: SwitchSize
  /** 选中时的文案 */
  checkedText?: string
  /** 未选中时的文案 */
  unCheckedText?: string
}>(), {
  checked: false,
  disabled: false,
  loading: false,
  size: 'middle',
  checkedText: '',
  unCheckedText: ''
})

const emit = defineEmits<{
  (e: 'update:checked', value: boolean): void
  (e: 'change', value: boolean): void
}>()

function toggle() {
  if (props.disabled || props.loading) return
  const next = !props.checked
  emit('update:checked', next)
  emit('change', next)
}
</script>

<template>
  <button
      class="xm-switch"
      :class="[
        `xm-switch--${size}`,
        {
          'is-checked': checked,
          'is-disabled': disabled,
          'has-text': checkedText || unCheckedText,
          'is-loading': loading
        }
      ]"
      type="button"
      role="switch"
      :aria-checked="checked"
      :disabled="disabled || loading"
      @click="toggle"
  >
    <span class="xm-switch__handle">
      <span v-if="loading" class="xm-switch__spinner" aria-hidden="true" />
    </span>
    <span v-if="checkedText || unCheckedText" class="xm-switch__text">
      {{ checked ? checkedText : unCheckedText }}
    </span>
  </button>
</template>

<style scoped>
.xm-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 22px;
  padding: 0 2px;
  border: 0;
  border-radius: 11px;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: background-color var(--xm-motion) var(--xm-ease);
}

.xm-switch.is-checked {
  background: var(--xm-color-primary);
}

.xm-switch:focus-visible {
  outline: 2px solid var(--xm-color-primary);
  outline-offset: 2px;
}

.xm-switch.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.xm-switch__handle {
  position: absolute;
  top: 2px;
  left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 35, 11, 0.2);
  transition: left var(--xm-motion) var(--xm-ease);
}

.xm-switch.is-checked .xm-switch__handle {
  left: calc(100% - 20px);
}

.xm-switch__text {
  font-size: var(--xm-font-size-sm);
  line-height: 1;
  color: #fff;
  user-select: none;
  padding: 0 10px 0 26px;
}

.xm-switch.is-checked .xm-switch__text {
  padding: 0 26px 0 10px;
}

/* 带文案时给轨道留出文字宽度 */
.xm-switch.has-text {
  min-width: 56px;
}

.xm-switch__spinner {
  width: 10px;
  height: 10px;
  border: 1.5px solid var(--xm-color-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: xm-switch-spin 0.8s linear infinite;
}

/* 小尺寸 */
.xm-switch--small {
  min-width: 32px;
  height: 16px;
  border-radius: 8px;
}

.xm-switch--small .xm-switch__handle {
  top: 2px;
  width: 12px;
  height: 12px;
}

.xm-switch--small.is-checked .xm-switch__handle {
  left: calc(100% - 14px);
}

.xm-switch--small .xm-switch__text {
  padding: 0 6px 0 18px;
}

.xm-switch--small.is-checked .xm-switch__text {
  padding: 0 18px 0 6px;
}

@keyframes xm-switch-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
