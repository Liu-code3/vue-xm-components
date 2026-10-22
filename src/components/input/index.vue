<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InputSize, InputStatus } from './type'

const props = withDefaults(defineProps<{
  /** 输入值，配合 v-model */
  modelValue?: string
  placeholder?: string
  size?: InputSize
  /** 校验状态 */
  status?: InputStatus
  disabled?: boolean
  readonly?: boolean
  /** 展示清空按钮 */
  allowClear?: boolean
  maxLength?: number
  /** 展示字数统计 */
  showCount?: boolean
  /** 原生 type */
  type?: 'text' | 'password' | 'number' | 'email' | 'search'
}>(), {
  modelValue: '',
  size: 'middle',
  status: 'default',
  disabled: false,
  readonly: false,
  allowClear: false,
  showCount: false,
  type: 'text'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', event: Event): void
  (e: 'clear'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'enter', event: KeyboardEvent): void
}>()

const inputRef = ref<HTMLInputElement>()
const focused = ref(false)
const hovering = ref(false)

/** 只在有内容且可编辑时显示清空按钮 */
const showClear = computed(
  () => props.allowClear && !props.disabled && !props.readonly && props.modelValue.length > 0
)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
  emit('change', event)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

function onFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') emit('enter', event)
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
})
</script>

<template>
  <div
      class="xm-input"
      :class="[
        `xm-input--${size}`,
        `is-${status}`,
        { 'is-focused': focused, 'is-disabled': disabled, 'is-hovering': hovering }
      ]"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
  >
    <span v-if="$slots.prefix" class="xm-input__prefix">
      <slot name="prefix" />
    </span>

    <input
        ref="inputRef"
        class="xm-input__inner"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
    />

    <span v-if="showCount" class="xm-input__count">
      {{ modelValue.length }}<template v-if="maxLength"> / {{ maxLength }}</template>
    </span>

    <button
        v-if="showClear"
        class="xm-input__clear"
        type="button"
        aria-label="清空"
        tabindex="-1"
        @click="onClear"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path
            d="M5.8 5.8 10.2 10.2 M10.2 5.8 5.8 10.2"
            stroke="#fff"
            stroke-width="1.4"
            stroke-linecap="round"
        />
      </svg>
    </button>

    <span v-if="$slots.suffix" class="xm-input__suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<style scoped>
.xm-input {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: var(--xm-control-height);
  padding: 0 11px;
  border: 1px solid var(--xm-color-border);
  border-radius: var(--xm-radius);
  background: var(--xm-color-bg);
  color: var(--xm-color-text);
  transition: border-color var(--xm-motion) var(--xm-ease), box-shadow var(--xm-motion) var(--xm-ease),
    background-color var(--xm-motion) var(--xm-ease);
}

.xm-input.is-hovering:not(.is-disabled) {
  border-color: var(--xm-color-primary-hover);
}

.xm-input.is-focused {
  border-color: var(--xm-color-primary);
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
}

.xm-input.is-disabled {
  background: var(--xm-color-fill);
  color: var(--xm-color-text-quaternary);
  cursor: not-allowed;
}

.xm-input.is-error {
  border-color: var(--xm-color-error);
}

.xm-input.is-error.is-focused {
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.12);
}

.xm-input.is-warning {
  border-color: var(--xm-color-warning);
}

.xm-input.is-warning.is-focused {
  box-shadow: 0 0 0 2px rgba(250, 173, 20, 0.12);
}

.xm-input__inner {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: var(--xm-font-size);
}

.xm-input__inner::placeholder {
  color: var(--xm-color-text-quaternary);
}

.xm-input__inner:disabled {
  cursor: not-allowed;
}

.xm-input__prefix,
.xm-input__suffix {
  display: inline-flex;
  align-items: center;
  flex: none;
  color: var(--xm-color-text-tertiary);
}

.xm-input__count {
  flex: none;
  font-size: var(--xm-font-size-sm);
  color: var(--xm-color-text-quaternary);
  font-variant-numeric: tabular-nums;
}

.xm-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 14px;
  height: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--xm-color-text-quaternary);
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--xm-motion) var(--xm-ease), color var(--xm-motion) var(--xm-ease);
}

.xm-input__clear svg {
  width: 100%;
  height: 100%;
}

.xm-input.is-hovering .xm-input__clear,
.xm-input.is-focused .xm-input__clear {
  opacity: 1;
}

.xm-input__clear:hover {
  color: var(--xm-color-text-tertiary);
}

/* 尺寸 */
.xm-input--small {
  height: var(--xm-control-height-sm);
  padding: 0 7px;
  border-radius: var(--xm-radius-sm);
}

.xm-input--small .xm-input__inner {
  font-size: var(--xm-font-size-sm);
}

.xm-input--large {
  height: var(--xm-control-height-lg);
  padding: 0 11px;
  font-size: var(--xm-font-size-lg);
}

.xm-input--large .xm-input__inner {
  font-size: var(--xm-font-size-lg);
}
</style>
