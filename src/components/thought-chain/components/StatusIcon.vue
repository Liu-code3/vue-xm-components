<script setup lang="ts">
import type { ThoughtChainStatus } from '../type'

withDefaults(defineProps<{
  /** 节点状态 */
  status?: ThoughtChainStatus
}>(), {
  status: 'pending'
})
</script>

<template>
  <span class="xm-tc-icon" :class="`xm-tc-icon--${status}`">
    <!-- 成功：实心圆 + 对勾 -->
    <svg v-if="status === 'success'" class="xm-tc-icon__svg" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path
          d="M4.6 8.3 6.9 10.6 11.5 5.9"
          fill="none"
          stroke="#fff"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
      />
    </svg>

    <!-- 失败：实心圆 + 叉 -->
    <svg v-else-if="status === 'error'" class="xm-tc-icon__svg" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path
          d="M5.6 5.6 10.4 10.4 M10.4 5.6 5.6 10.4"
          fill="none"
          stroke="#fff"
          stroke-width="1.6"
          stroke-linecap="round"
      />
    </svg>

    <!-- 进行中：旋转的圆环 -->
    <span v-else-if="status === 'loading'" class="xm-tc-icon__ring" />

    <!-- 等待中：空心小圆点 -->
    <span v-else class="xm-tc-icon__dot" />
  </span>
</template>

<style scoped>
.xm-tc-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: var(--xm-tc-node);
  height: var(--xm-tc-node);
  color: var(--xm-tc-text-tertiary);
}

.xm-tc-icon__svg {
  display: block;
  width: 100%;
  height: 100%;
}

.xm-tc-icon--success {
  color: var(--xm-tc-success);
}

.xm-tc-icon--error {
  color: var(--xm-tc-error);
}

.xm-tc-icon--loading {
  color: var(--xm-tc-primary);
}

.xm-tc-icon__ring {
  width: 76%;
  height: 76%;
  border-radius: 50%;
  border: 2px solid var(--xm-tc-primary-weak);
  border-top-color: var(--xm-tc-primary);
  animation: xm-tc-spin 0.8s linear infinite;
}

.xm-tc-icon__dot {
  width: 30%;
  height: 30%;
  border-radius: 50%;
  border: 1.5px solid currentColor;
}

@keyframes xm-tc-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
