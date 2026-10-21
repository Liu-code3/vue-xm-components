<script setup lang="ts">
import type { PromptItem } from './type'

withDefaults(defineProps<{
  /** 提示词列表 */
  items?: PromptItem[]
  /** 分组标题 */
  title?: string
  /** 列数，窄屏自动降为单列 */
  columns?: number
}>(), {
  items: () => [],
  title: '',
  columns: 2
})

const emit = defineEmits<{
  (e: 'itemClick', item: PromptItem, index: number): void
}>()
</script>

<template>
  <div class="xm-prompts">
    <div v-if="title" class="xm-prompts__title">{{ title }}</div>

    <div class="xm-prompts__list" :style="{ '--xm-prompts-columns': columns }">
      <button
          v-for="(item, index) in items"
          :key="item.key ?? index"
          class="xm-prompts__item"
          type="button"
          @click="emit('itemClick', item, index)"
      >
        <span class="xm-prompts__icon">
          <slot name="icon" :item="item" :index="index">
            <span v-if="item.icon" class="xm-prompts__emoji">{{ item.icon }}</span>
            <svg v-else viewBox="0 0 16 16" aria-hidden="true">
              <path
                  d="M8 1.8 9.4 5.7 13.3 7.1 9.4 8.5 8 12.4 6.6 8.5 2.7 7.1 6.6 5.7Z"
                  fill="currentColor"
              />
            </svg>
          </slot>
        </span>

        <span class="xm-prompts__body">
          <span class="xm-prompts__label">
            <slot name="label" :item="item" :index="index">{{ item.label }}</slot>
          </span>
          <span v-if="item.description" class="xm-prompts__desc">{{ item.description }}</span>
        </span>

        <svg class="xm-prompts__arrow" viewBox="0 0 16 16" aria-hidden="true">
          <path
              d="M6.2 4.2 10 8 6.2 11.8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.xm-prompts__title {
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
}

.xm-prompts__list {
  display: grid;
  grid-template-columns: repeat(var(--xm-prompts-columns, 2), minmax(0, 1fr));
  gap: 10px;
}

.xm-prompts__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.xm-prompts__item:hover {
  border-color: #91caff;
  background: #f5faff;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.08);
  transform: translateY(-1px);
}

.xm-prompts__item:active {
  transform: none;
}

.xm-prompts__item:focus-visible {
  outline: 2px solid #1677ff;
  outline-offset: 2px;
}

.xm-prompts__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #e6f4ff;
  color: #1677ff;
}

.xm-prompts__icon svg {
  width: 16px;
  height: 16px;
}

.xm-prompts__emoji {
  font-size: 14px;
  line-height: 1;
}

.xm-prompts__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.xm-prompts__label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.xm-prompts__desc {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.xm-prompts__arrow {
  flex: none;
  width: 14px;
  height: 14px;
  margin-left: auto;
  color: #bfbfbf;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
}

.xm-prompts__item:hover .xm-prompts__arrow {
  opacity: 1;
  transform: translateX(2px);
}

@media (max-width: 640px) {
  .xm-prompts__list {
    grid-template-columns: 1fr;
  }
}
</style>
