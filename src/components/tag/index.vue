<script setup lang="ts">
import { computed } from 'vue'
import type { TagColor } from './type'

const props = withDefaults(defineProps<{
  /** 预设色名，或 #RRGGBB 自定义颜色 */
  color?: TagColor | string
  /** 可关闭 */
  closable?: boolean
  /** 是否带边框 */
  bordered?: boolean
}>(), {
  color: 'default',
  closable: false,
  bordered: true
})

const emit = defineEmits<{
  (e: 'close', event: MouseEvent): void
}>()

/** 传十六进制色值时走自定义样式，颜色通过 CSS 变量注入 */
const isCustom = computed(() => props.color.startsWith('#'))

const customStyle = computed(() => (isCustom.value ? { '--xm-tag-color': props.color } : {}))
</script>

<template>
  <span
      class="xm-tag"
      :class="[
        isCustom ? 'is-custom' : `xm-tag--${color}`,
        { 'is-bordered': bordered }
      ]"
      :style="customStyle"
  >
    <slot name="icon" />
    <slot />
    <button
        v-if="closable"
        class="xm-tag__close"
        type="button"
        aria-label="关闭"
        @click.stop="emit('close', $event)"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
            d="M4.6 4.6 11.4 11.4 M11.4 4.6 4.6 11.4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
        />
      </svg>
    </button>
  </span>
</template>

<style scoped>
.xm-tag {
  --xm-tag-color: var(--xm-color-text-secondary);
  --xm-tag-bg: var(--xm-color-fill);
  --xm-tag-border: var(--xm-color-border);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 7px;
  border: 1px solid transparent;
  border-radius: var(--xm-radius-sm);
  background: var(--xm-tag-bg);
  color: var(--xm-tag-color);
  font-size: var(--xm-font-size-sm);
  line-height: 20px;
  white-space: nowrap;
}

.xm-tag.is-bordered {
  border-color: var(--xm-tag-border);
}

.xm-tag--primary {
  --xm-tag-color: #0958d9;
  --xm-tag-bg: var(--xm-color-primary-bg);
  --xm-tag-border: var(--xm-color-primary-border);
}

.xm-tag--success {
  --xm-tag-color: #389e0d;
  --xm-tag-bg: var(--xm-color-success-bg);
  --xm-tag-border: var(--xm-color-success-border);
}

.xm-tag--warning {
  --xm-tag-color: #d48806;
  --xm-tag-bg: var(--xm-color-warning-bg);
  --xm-tag-border: var(--xm-color-warning-border);
}

.xm-tag--error {
  --xm-tag-color: #cf1322;
  --xm-tag-bg: var(--xm-color-error-bg);
  --xm-tag-border: var(--xm-color-error-border);
}

.xm-tag--purple {
  --xm-tag-color: #531dab;
  --xm-tag-bg: #f9f0ff;
  --xm-tag-border: #d3adf7;
}

.xm-tag--cyan {
  --xm-tag-color: #08979c;
  --xm-tag-bg: #e6fffb;
  --xm-tag-border: #87e8de;
}

.xm-tag--magenta {
  --xm-tag-color: #c41d7f;
  --xm-tag-bg: #fff0f6;
  --xm-tag-border: #ffadd2;
}

/* 自定义色：用 color-mix 从同一个色值派生背景与边框 */
.xm-tag.is-custom {
  color: var(--xm-tag-color);
  background: #f5f5f5;
  background: color-mix(in srgb, var(--xm-tag-color) 12%, #fff);
  border-color: color-mix(in srgb, var(--xm-tag-color) 35%, #fff);
}

.xm-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  margin-right: -2px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity var(--xm-motion) var(--xm-ease);
}

.xm-tag__close svg {
  width: 100%;
  height: 100%;
}

.xm-tag__close:hover {
  opacity: 1;
}
</style>
