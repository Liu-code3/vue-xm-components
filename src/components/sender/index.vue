<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { SenderSubmitType } from './type'

const props = withDefaults(defineProps<{
  /** 输入内容，配合 v-model 使用 */
  modelValue?: string
  placeholder?: string
  /** 生成中，按钮变成停止 */
  loading?: boolean
  disabled?: boolean
  maxLength?: number
  /** 展示字数统计 */
  showCount?: boolean
  /** 高度自适应内容 */
  autoSize?: boolean
  /** 发送快捷键 */
  submitType?: SenderSubmitType
  /** 最大高度，超出后内部滚动 */
  maxHeight?: number
}>(), {
  modelValue: '',
  placeholder: '输入内容，Enter 发送，Shift + Enter 换行',
  loading: false,
  disabled: false,
  showCount: false,
  autoSize: true,
  submitType: 'enter',
  maxHeight: 160
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit', value: string): void
  (e: 'cancel'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const textareaRef = ref<HTMLTextAreaElement>()
/** 输入法组合中（中文拼音还没上屏），此时不能触发发送 */
const composing = ref(false)
const focused = ref(false)

const canSubmit = computed(() => props.modelValue.trim().length > 0 && !props.disabled)
const count = computed(() => props.modelValue.length)

function resize() {
  const el = textareaRef.value
  if (!el || !props.autoSize) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, props.maxHeight)}px`
  el.style.overflowY = el.scrollHeight > props.maxHeight ? 'auto' : 'hidden'
}

watch(() => props.modelValue, () => nextTick(resize))
onMounted(resize)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  nextTick(resize)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') return
  // 输入法组合期间的回车只是选词，不发送
  if (composing.value || event.isComposing) return

  const withCtrl = props.submitType === 'ctrlEnter'
  const pressedCtrl = event.ctrlKey || event.metaKey

  if (withCtrl ? !pressedCtrl : event.shiftKey || pressedCtrl) return

  event.preventDefault()
  submit()
}

function submit() {
  if (props.loading || !canSubmit.value) return
  emit('submit', props.modelValue.trim())
}

function onFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
}

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  clear: () => {
    emit('update:modelValue', '')
    nextTick(resize)
  }
})
</script>

<template>
  <div class="xm-sender" :class="{ 'is-focused': focused, 'is-disabled': disabled }">
    <textarea
        ref="textareaRef"
        class="xm-sender__input"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        rows="1"
        @input="onInput"
        @keydown="onKeydown"
        @compositionstart="composing = true"
        @compositionend="composing = false"
        @focus="onFocus"
        @blur="onBlur"
    />

    <div class="xm-sender__footer">
      <div class="xm-sender__prefix">
        <slot name="prefix" />
      </div>

      <div class="xm-sender__actions">
        <span v-if="showCount" class="xm-sender__count">
          {{ count }}<template v-if="maxLength"> / {{ maxLength }}</template>
        </span>

        <slot name="actions" />

        <button
            v-if="loading"
            class="xm-sender__btn is-stop"
            type="button"
            aria-label="停止生成"
            @click="emit('cancel')"
        >
          <span class="xm-sender__stop" />
        </button>
        <button
            v-else
            class="xm-sender__btn"
            type="button"
            aria-label="发送"
            :disabled="!canSubmit"
            @click="submit"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
                d="M8 12.5V3.8M8 3.8 4.2 7.6M8 3.8 11.8 7.6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.xm-sender {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.xm-sender.is-focused {
  border-color: #1677ff;
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.12);
}

.xm-sender.is-disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.xm-sender__input {
  width: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.88);
  font: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  overflow-y: hidden;
}

.xm-sender__input::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

.xm-sender__input:disabled {
  cursor: not-allowed;
}

.xm-sender__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.xm-sender__prefix,
.xm-sender__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.xm-sender__count {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  font-variant-numeric: tabular-nums;
}

.xm-sender__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #1677ff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.xm-sender__btn svg {
  width: 16px;
  height: 16px;
}

.xm-sender__btn:hover:not(:disabled) {
  background: #4096ff;
}

.xm-sender__btn:disabled {
  background: #f0f0f0;
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}

.xm-sender__btn.is-stop {
  background: #f0f0f0;
  color: rgba(0, 0, 0, 0.65);
}

.xm-sender__stop {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: currentColor;
}
</style>
