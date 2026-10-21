<script setup lang="ts">
import type { BubblePlacement, BubbleVariant } from './type'

withDefaults(defineProps<{
  /** 文本内容，复杂内容用默认插槽 */
  content?: string
  /** 气泡位置 */
  placement?: BubblePlacement
  /** 外观：填充 / 描边 */
  variant?: BubbleVariant
  /** 头像图片地址 */
  avatar?: string
  /** 名称，展示在气泡上方，也是无头像时的首字母 */
  name?: string
  /** 加载态，展示三点动画 */
  loading?: boolean
  /** 气泡最大宽度 */
  maxWidth?: string
}>(), {
  placement: 'start',
  variant: 'filled',
  name: '',
  loading: false,
  maxWidth: '560px'
})
</script>

<template>
  <div
      class="xm-bubble"
      :class="[`xm-bubble--${placement}`, `xm-bubble--${variant}`]"
      :style="{ '--xm-bubble-max-width': maxWidth }"
  >
    <div class="xm-bubble__avatar">
      <slot name="avatar">
        <img v-if="avatar" class="xm-bubble__avatar-img" :src="avatar" :alt="name || 'avatar'" />
        <span v-else class="xm-bubble__avatar-fallback">
          <svg v-if="placement === 'start'" viewBox="0 0 16 16" aria-hidden="true">
            <path
                d="M8 1.6 9.3 5.5 13.2 6.8 9.3 8.1 8 12 6.7 8.1 2.8 6.8 6.7 5.5Z"
                fill="currentColor"
            />
            <path d="M12.4 10.6 13 12.2 14.6 12.8 13 13.4 12.4 15 11.8 13.4 10.2 12.8 11.8 12.2Z" fill="currentColor" opacity=".7" />
          </svg>
          <span v-else>{{ (name || '我').slice(0, 1) }}</span>
        </span>
      </slot>
    </div>

    <div class="xm-bubble__main">
      <div v-if="name || $slots.header" class="xm-bubble__header">
        <slot name="header">{{ name }}</slot>
      </div>

      <div class="xm-bubble__content">
        <span v-if="loading" class="xm-bubble__dots" role="status" aria-label="加载中">
          <i /><i /><i />
        </span>
        <slot v-else>
          <span class="xm-bubble__text">{{ content }}</span>
        </slot>
      </div>

      <div v-if="$slots.footer" class="xm-bubble__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.xm-bubble {
  --xm-bubble-bg: #f5f6f8;
  --xm-bubble-color: rgba(0, 0, 0, 0.88);
  --xm-bubble-radius: 12px;
  --xm-bubble-border: transparent;

  display: flex;
  align-items: flex-start;
  gap: 10px;
  /* 整行占满，靠左 / 靠右由 flex-direction 决定，父容器不用关心对齐 */
  width: 100%;
}

.xm-bubble--end {
  flex-direction: row-reverse;
}

.xm-bubble__avatar {
  flex: none;
  width: 32px;
  height: 32px;
}

.xm-bubble__avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.xm-bubble__avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #1677ff, #69b1ff);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  user-select: none;
}

.xm-bubble__avatar-fallback svg {
  width: 18px;
  height: 18px;
}

.xm-bubble--end .xm-bubble__avatar-fallback {
  background: #f0f0f0;
  color: rgba(0, 0, 0, 0.65);
}

.xm-bubble__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: var(--xm-bubble-max-width);
}

.xm-bubble--end .xm-bubble__main {
  align-items: flex-end;
}

.xm-bubble__header {
  margin-bottom: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.45);
}

.xm-bubble__content {
  padding: 10px 14px;
  border: 1px solid var(--xm-bubble-border);
  border-radius: var(--xm-bubble-radius);
  background: var(--xm-bubble-bg);
  color: var(--xm-bubble-color);
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.xm-bubble__text {
  white-space: pre-wrap;
}

.xm-bubble--start .xm-bubble__content {
  border-top-left-radius: 4px;
}

.xm-bubble--end .xm-bubble__content {
  --xm-bubble-bg: #e6f4ff;
  --xm-bubble-color: #0958d9;
  border-top-right-radius: 4px;
}

.xm-bubble--outlined .xm-bubble__content {
  --xm-bubble-bg: #fff;
  --xm-bubble-border: #e5e6eb;
}

.xm-bubble__footer {
  margin-top: 6px;
}

.xm-bubble__dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
}

.xm-bubble__dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.25;
  animation: xm-bubble-blink 1.2s ease-in-out infinite;
}

.xm-bubble__dots i:nth-child(2) {
  animation-delay: 0.15s;
}

.xm-bubble__dots i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes xm-bubble-blink {
  0%,
  80%,
  100% {
    opacity: 0.2;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-2px);
  }
}
</style>
