<script setup lang="ts">
import type { ActionItem } from './type'
import ActionIcon from './components/ActionIcon.vue'

withDefaults(defineProps<{
  /** 操作项 */
  items?: ActionItem[]
  /** 尺寸 */
  size?: 'small' | 'middle'
}>(), {
  items: () => [],
  size: 'middle'
})

const emit = defineEmits<{
  (e: 'action', item: ActionItem, index: number): void
}>()
</script>

<template>
  <div class="xm-actions" :class="`xm-actions--${size}`">
    <button
        v-for="(item, index) in items"
        :key="item.key"
        class="xm-actions__item"
        :class="{ 'is-danger': item.danger, 'is-active': item.active }"
        type="button"
        :disabled="item.disabled"
        :title="item.label"
        :aria-label="item.label || item.key"
        @click="emit('action', item, index)"
    >
      <ActionIcon v-if="item.icon" :name="item.icon" />
      <span v-if="item.label" class="xm-actions__label">{{ item.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.xm-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.xm-actions__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  min-width: 28px;
  padding: 0 6px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: rgba(0, 0, 0, 0.45);
  font: inherit;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.xm-actions--small .xm-actions__item {
  height: 24px;
  min-width: 24px;
  padding: 0 4px;
}

.xm-actions__item:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.88);
}

.xm-actions__item:focus-visible {
  outline: 2px solid #1677ff;
  outline-offset: 2px;
}

.xm-actions__item.is-active {
  color: #1677ff;
}

.xm-actions__item.is-danger:hover:not(:disabled) {
  background: #fff2f0;
  color: #ff4d4f;
}

.xm-actions__item:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.xm-actions__label {
  font-size: 12px;
  line-height: 1;
}
</style>
